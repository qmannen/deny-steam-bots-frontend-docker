// main.js
const express = require('express');
const util    = require('util');
const { exec } = require('child_process');
const execAsync = util.promisify(exec);
const {
  clientId,
  tenantId,
  token,
  subscription,
  resourceGroup,
  containerGroup
} = require('./config');

const app  = express();
const port = 3000;

// Validate required env-vars
if (!clientId || !tenantId || !token) {
  throw new Error(
    'Please set AZURE_CLIENT_ID, AZURE_TENANT_ID, and AZURE_ACCESS_TOKEN'
  );
}
if (!resourceGroup || !containerGroup) {
  throw new Error(
    'Please set AZURE_RESOURCE_GROUP and AZURE_CONTAINER_GROUP'
  );
}

let loggedIn = false;

// Perform non-interactive SP login once
async function ensureLogin() {
  await execAsync(
    `az login --service-principal \
     --username ${clientId} \
     --password ${token} \
     --tenant ${tenantId}`
  );
  if (subscription) {
    await execAsync(`az account set --subscription ${subscription}`);
  }
  console.log('✅ Logged into Azure CLI');
  loggedIn = true;
}

app.get('/logs', async (req, res) => {
  try {
    if (!loggedIn) {
      await ensureLogin();
    }

    const { stdout, stderr } = await execAsync(
      `az container logs \
       --resource-group ${resourceGroup} \
       --name ${containerGroup}`
    );

    if (stderr) {
      console.error('stderr:', stderr);
      return res.status(500).send(stderr);
    }
    res.type('text/plain').send(stdout);

  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Running Express service @ http://localhost:${port}`);
});
