pipeline {
    agent any
    environment {
        // ENV_FILE=credentials("temp-tac-toe-${params.Environment}")
    }
    stages {
        // stage("Setup Environment") {
        //     steps {
        //             echo "⚙️ Creating environment file with credentials..."
        //             sh 'cp $ENV_FILE .env'
        //     }
        // }
        stage("Run Container") {
            steps {
                dir('stargaze') {
                    echo "🐳 Building and running Docker container..."
                    sh """
                    docker-compose up -d --build
                    """
                }
            }
        }
        // stage("Migrate Database") {
        //     steps {
        //         echo "🔼 Running Prisma migrations..."
        //         sh """
        //         docker-compose exec -T app npx prisma migrate deploy
        //         """
        //     }
        // }
    }
    post {
        success {
            echo "🎉 Deployment successful!"
        }
        failure {
            echo "🚨 Deployment failed!"
        }
    }
}