pipeline {
    agent { label 'MTX_Agent' }
tools{
        nodejs 'Nodejs'
    }
   environment {
        USER = credentials('ER_User')
        HOST = credentials('ER_Host')
        KEY_PATH = credentials('ER_Key_Path')
        REMOTE_APP_DIR = credentials('ERn_remote_app_dir')
        LOCAL_BUILD_DIR = credentials('ERn_local_build_dir')
        // GITLAB_REPO_URL = credentials('Fhn_repo')
        CI = 'false'
        SONAR_AUTH_TOKEN = credentials('ER_Sonar_Auth_Token')
        SONAR_HOST_URL = credentials('ER_Sonar_Host_URL')
        PROJECT_KEY = credentials('ERn_sonar_project_key')
        PROJECT_NAME = credentials('ERn_sonar_project_name')
        EMAIL_RECEIVERS = credentials('ER_email_receivers')
        targetBranch = ''
       }
    stages {
        // stage('Checkout') {
        //     steps {
        //         echo "Checkout the code from the repository"
        //         checkout scmGit(branches: [[name: "${BRANCH}"]], extensions: [], userRemoteConfigs: [[credentialsId: '7a1cbcff-daff-4232-af15-4c7a1e31f2d1', url: "${GITLAB_REPO_URL}"]])
        //     }
        // } 
        stage('checking branch name') {
            steps {
                script {
                    targetBranch = env.GIT_BRANCH.replace('origin/', '')
                    echo "Target Branch: ${targetBranch}"
                }
            }
        }
        stage('SonarQube Analysis on DEV') {
            when {
                expression { targetBranch == 'dev' } // Only execute if the branch is 'dev'
            }
            environment{
                SonarScannerHome = tool 'Hilton'
            }
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${SonarScannerHome}/bin/sonar-scanner/bin/sonar-scanner -X \
                                -Dsonar.projectKey=${PROJECT_KEY} \
                                -Dsonar.projectName=${PROJECT_NAME} \
                                -Dsonar.sources=. \
                                -Dsonar.java.binaries=target/test-classes/com/visualpathit/account/controllerTest/ \
                                -Dsonar.junit.reportsPath=target/surefire-reports/ \
                                -Dsonar.jacoco.reportsPath=target/jacoco.exec \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.token=${SONAR_AUTH_TOKEN}
                        """
                    }
                }
            }
        }
        stage('Quality Gate'){
            steps{
                timeout(time: 20, unit: 'MINUTES'){
                waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Deploy to EC2 on DEV') {
            when {
                expression { targetBranch == 'dev' } // Only execute if the branch is 'dev'
            }
            steps {
                script {
                    echo "Deploying build to EC2 instance"
                    echo "SCP the build directory to the EC2 instance"
                    sh """
                    rsync -avz -e 'ssh -i ${KEY_PATH} -o StrictHostKeyChecking=no' ${LOCAL_BUILD_DIR} ${USER}@${HOST}:${REMOTE_APP_DIR}
                    """
                }
            }
        }
        stage('Login to server for DEV'){
            when {
                expression { targetBranch == 'dev' } // Only execute if the branch is 'dev'
            }
            steps{
                script{
                    echo "started the login"
                    sh """
                        ssh -i ${KEY_PATH} ${USER}@${HOST} << 'EOF'
                            echo "Connected successfully"
                            cd ${REMOTE_APP_DIR} && echo "Changed directory to ${REMOTE_APP_DIR}"
                            rm -f package-lock.json && echo "Removed package-lock.json"
                            yarn install && echo "Yarn install complete"
                            cp .en.dev .env && echo ".env file copied"
                            knex migrate:latest && echo "Knex migrations completed"
                            pm2 restart all --update-env && echo "pm2 processes restarted"
                    """
                }
            }
        }
    }

    post {
        always{
            emailext attachLog: true, body: """Pipeline Details:-
Pipeline Name: ${env.JOB_NAME}
Execution Status: ${currentBuild.currentResult}
Build Number: ${env.BUILD_NUMBER}""", subject: """${env.JOB_NAME} - ${env.BUILD_NUMBER} - ${currentBuild.currentResult}""", to: """${EMAIL_RECEIVERS}"""
        }
    }
}
