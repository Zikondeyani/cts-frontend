CTS has two backends: 

1. live backend:
# ENDPOINTS
VUE_APP_ROOT_API=https://engine.immalawi.org/cts
VUE_APP_MAIL_API=https://engine.immalawi.org/cts

2. Training backend:
# ENDPOINTS
VUE_APP_ROOT_API=https://engine.immalawi.org/cts_backend_training
VUE_APP_MAIL_API=https://engine.immalawi.org/cts_backend_training

#NOTE
The VUE_APP_ROOT_API is the main endpoint to the backend for interacting with database while the VUE_APP_MAIL_API is the endpoint for mailing service.

#FRONTEND
The frontend is the same, we only change .env in frontend code to either connect the frontend to training backend or live backend.
Do not change any configuration in the .env of backend code since it is how it was configured for reverse proxy in the server. 

#HOW TO UPDATE THE APP
To build the app, run 'npm run build' in either backend or frontend. After this command runs, copy all 
the files in 'dist' folder and paste (to replace) them in 'dist' folder in the server for either backend or frontend.

#RESTART THE APPS IN SERVER
After new deployments, run 'pm2 restall all' to restart both frontend and backend
