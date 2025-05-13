const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// Replace with your actual resource group and container group names
const RESOURCE_GROUP = 'myResourceGroup';
const CONTAINER_GROUP = 'myContainerGroup';

app.get('/logs', (req, res) => {
  const command = `az container logs --resource-group ${RESOURCE_GROUP} --name ${CONTAINER_GROUP}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error fetching logs: ${error.message}`);
      return res.status(500).send(`Error fetching logs: ${error.message}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send(`stderr: ${stderr}`);
    }
    res.type('text/plain').send(stdout);
  });
});

app.listen(port, () => {
  console.log(`ACI Log Viewer running at http://localhost:${port}`);
});
