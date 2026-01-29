pipeline {
    agent any

    environment {
        REGISTRY         = 'harbor.tsirylab.com'
        HARBOR_PROJECT   = 'pnud-agvm'
        IMAGE_NAME       = 'matac'
        IMAGE_TAG        = "${BUILD_NUMBER}"
        FULL_IMAGE_NAME  = "${REGISTRY}/${HARBOR_PROJECT}/${IMAGE_NAME}:${IMAGE_TAG}"
        NAMESPACE        = 'pnud-agvm'
        K8S_DIR          = 'k8s'
        DEPLOYMENT_NAME  = 'matac'
        SERVICE_NAME     = 'matac-service'
        HPA_NAME         = 'matac-hpa'
        SECRET_NAME      = 'matac-secret'
        VITE_PORT        = '4015'
        VITE_API_URL     = 'https://gateway.tsirylab.com'
        VITE_APP_ID = '32'
        VITE_GEOSERVER_URL = '/geoserver/Fianarantsoa'
        VITE_WORKSPACE= 'Fianarantsoa'
        VITE_API_BASE_URL = 'http://31.220.94.42:5353/'
    }

    stages {
        stage('Build & Push') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'harbor-credentials',
                                     usernameVariable: 'HARBOR_USER',
                                     passwordVariable: 'HARBOR_PASS')
                ]) {
                    sh '''
                        set -e
                        docker logout ${REGISTRY} || true

                        docker build \
                          --build-arg VITE_API_URL=${VITE_API_URL} \
                          --build-arg VITE_PORT=${VITE_PORT} \
                          --build-arg VITE_APP_ID=${VITE_APP_ID} \
                          --build-arg VITE_GEOSERVER_URL=${VITE_GEOSERVER_URL} \
                          --build-arg VITE_WORKSPACE=${VITE_WORKSPACE} \
                          --build-arg VITE_API_BASE_URL=${VITE_API_BASE_URL} \
                          -t ${FULL_IMAGE_NAME} .

                        echo ${HARBOR_PASS} | \
                          docker login -u ${HARBOR_USER} --password-stdin ${REGISTRY}

                        docker push ${FULL_IMAGE_NAME}
                        docker logout ${REGISTRY}
                    '''
                }
            }
        }

        stage('Deploy to K3s') {
            steps {
                withCredentials([
                    file(credentialsId: 'kubeconfig-jenkins', variable: 'KUBECONFIG'),
                    usernamePassword(credentialsId: 'harbor-credentials',
                                     usernameVariable: 'HARBOR_USER',
                                     passwordVariable: 'HARBOR_PASS')
                ]) {
                    sh '''
                        set -e
                        export KUBECONFIG=${KUBECONFIG}

                        kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

                        kubectl delete secret harbor-registry-secret -n ${NAMESPACE} --ignore-not-found
                        kubectl create secret docker-registry harbor-registry-secret \
                          --docker-server=${REGISTRY} \
                          --docker-username="${HARBOR_USER}" \
                          --docker-password="${HARBOR_PASS}" \
                          --namespace=${NAMESPACE}

                        kubectl delete secret ${SECRET_NAME} -n ${NAMESPACE} --ignore-not-found
                        kubectl create secret generic ${SECRET_NAME} \
                          --from-literal=VITE_API_URL="${VITE_API_URL}" \
                          --from-literal=VITE_APP_ID="${VITE_APP_ID}" \
                          --from-literal=VITE_PORT="${VITE_PORT}" \
                          --from-literal=VITE_GEOSERVER_URL="${VITE_GEOSERVER_URL}" \
                          --from-literal=VITE_WORKSPACE="${VITE_WORKSPACE}" \
                          --from-literal=VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
                          --namespace=${NAMESPACE}

                        # template toutes les ressources
                        for res in deployment service hpa secret; do
                            envsubst < ${K8S_DIR}/${DEPLOYMENT_NAME}.$res.yaml > /tmp/${DEPLOYMENT_NAME}.$res.yaml
                            kubectl apply -f /tmp/${DEPLOYMENT_NAME}.$res.yaml
                        done

                        kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE} --timeout=600s
                        kubectl get pods -n ${NAMESPACE} -l app=${DEPLOYMENT_NAME}
                    '''
                }
            }
        }
    }

    post { always { cleanWs() } }
}
