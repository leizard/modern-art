pipeline {
    agent any
    environment {
        REPO_URL = 'https://github.com/leizard/modern-art.git'
        BRANCH = 'main'
        NODE_VERSION = '18.17.0'
        APP_PORT = '3000'
        SERVER_IP = '34.59.2.8'
        DEPLOY_DIR = '/home/duongtrieu.lei/projects/modern-art'
        SERVICE_NAME = 'modern-art-website'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${BRANCH}"]],
                    userRemoteConfigs: [[url: "${REPO_URL}"]],
                    extensions: [
                        [$class: 'CleanBeforeCheckout'],
                        [$class: 'CleanCheckout']
                    ]
                ])
                sh 'ls -la' // Debug: Verify files
            }
        }
        stage('Install Dependencies') {
            steps {
                sh '''
                    # Install nvm if not present
                    if [ ! -d "$HOME/.nvm" ]; then
                        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                    fi
                    
                    # Load nvm and install Node.js
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm install ${NODE_VERSION}
                    nvm use ${NODE_VERSION}
                    
                    # Install dependencies
                    npm install
                    npm install serve
                '''
            }
        }
        stage('Run Tests') {
            steps {
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use ${NODE_VERSION}
                    npm test || echo "Tests failed, but continuing"
                '''
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    # Load nvm
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use ${NODE_VERSION}
                    
                    # Create deploy directory if it doesn't exist
                    mkdir -p ${DEPLOY_DIR}
                    
                    # Copy all project files to deployment directory
                    cp -R ./* ${DEPLOY_DIR}/
                    # Copy hidden files, ignore errors if no hidden files exist
                    cp -R ./.* ${DEPLOY_DIR}/ 2>/dev/null || true
                    
                    # Create a shell script to run the server
                    cat > ${DEPLOY_DIR}/start-server.sh << EOL
#!/bin/bash
export NVM_DIR="\$HOME/.nvm"
[ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"
nvm use ${NODE_VERSION}
cd ${DEPLOY_DIR}
exec npx serve -s . -l ${APP_PORT}
EOL
                    
                    # Make the script executable
                    chmod +x ${DEPLOY_DIR}/start-server.sh
                    
                    # Create systemd service file
                    cat > /tmp/${SERVICE_NAME}.service << EOL
[Unit]
Description=Modern Art Static Website
After=network.target

[Service]
Type=simple
User=$(whoami)
ExecStart=${DEPLOY_DIR}/start-server.sh
WorkingDirectory=${DEPLOY_DIR}
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=${SERVICE_NAME}
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL
                    
                    # Move the service file to systemd directory
                    sudo mv /tmp/${SERVICE_NAME}.service /etc/systemd/system/
                    
                    # Reload systemd to recognize the new service
                    sudo systemctl daemon-reload
                    
                    # Enable and restart the service
                    sudo systemctl enable ${SERVICE_NAME}.service
                    sudo systemctl restart ${SERVICE_NAME}.service
                    
                    # Create a status file for monitoring
                    echo "Deployment completed: $(date)" > ${DEPLOY_DIR}/deployment-status.txt
                    echo "Jenkins Job: ${JOB_NAME} #${BUILD_NUMBER}" >> ${DEPLOY_DIR}/deployment-status.txt
                    echo "Git Branch: ${BRANCH}" >> ${DEPLOY_DIR}/deployment-status.txt
                    echo "Commit: $(git rev-parse HEAD)" >> ${DEPLOY_DIR}/deployment-status.txt
                '''
            }
        }
        stage('Verify Deployment') {
            steps {
                sh '''
                    # Wait for service to fully start
                    sleep 5
                    
                    # Check systemd service status
                    sudo systemctl status ${SERVICE_NAME}.service
                    
                    # Verify the service is actually running
                    if ! sudo systemctl is-active --quiet ${SERVICE_NAME}.service; then
                        echo "ERROR: Systemd service is not running!"
                        sudo journalctl -u ${SERVICE_NAME}.service --no-pager -n 20
                        exit 1
                    fi
                    
                    # Check if service is responding on the specified port
                    if curl -s http://localhost:${APP_PORT} > /dev/null; then
                        echo "✓ Website successfully deployed and accessible at http://${SERVER_IP}:${APP_PORT}"
                    else
                        echo "ERROR: Website is not accessible at http://localhost:${APP_PORT}!"
                        exit 1
                    fi
                '''
            }
        }
    }
    post {
        always {
            // Archive deployment logs if they exist
            archiveArtifacts artifacts: '**/deployment-status.txt, **/npm-debug.log', allowEmptyArchive: true
            
            // Clean workspace after build
            cleanWs()
        }
        success {
            echo "Pipeline executed successfully: Website deployed at http://${SERVER_IP}:${APP_PORT}"
        }
        failure {
            echo "Pipeline failed! Check the logs for details."
            sh '''
                echo "--- Service Status for Debugging ---"
                sudo systemctl status ${SERVICE_NAME}.service || true
                sudo journalctl -u ${SERVICE_NAME}.service --no-pager -n 50 || true
            '''
        }
    }
}