const msrestazure = require('ms-rest-azure');
const storageManagement = require('azure-arm-storage');

const options = {};
const subscriptionId = process.env['YOUR_AZURE_SUBSCRIPTION_ID'];

/*
 * SUPPORTED AZURE ENVIRONMENT NAMES
 * 
 * International Cloud (default): Azure
 * German Cloud: AzureGermanCloud
 * China Cloud: AzureChina
 * US Government Cloud: AzureUSGovernment 
 */
options.environment = msrestazure.AzureEnvironment.AzureGermanCloud;

/*
 * INTERACTIVE LOGIN
 * 
 * Programmatically triggering the interactive login which only supports Microsoft (aka Live ID)
 * accounts.
 *  
 * Be sure to pass an initialized options object to this function if you want to authenticate
 * against an Azure environment different from the International Cloud which is used per default.
 * 
 * The callback will be passed a credentials (creds) object that stores a valid token
 * which you can use to authenticate calls against the control plane.
 */
msrestazure.interactiveLogin(options, function(err, creds, subscriptions) {
  if (err) {
    console.log(err);
    return;
  }

  /*
   * TALKING TO CONTROL PLANE
   * 
   * Initializing a storage management client object to talk to the control plane of Azure Storage.
   * Per default, the resource management endpoint 'https://management.azure.com' of the International Cloud will be used (as can 
   * be seen at https://github.com/Azure/azure-sdk-for-node/blob/master/lib/services/storageManagement2/lib/storageManagementClient.js#L70-L72
   * 
   * In order to choose a different resource management endpoint of the Azure environment you like
   * to use, be sure to explicitly pass the according endpoint as specified below. For your convenience
   * these are already defined as a 'resourceManagerEndpointUrl' variable in  require('ms-rest-azure').AzureEnvironment.<env-name>:
   * 
   *  International Cloud (default): Azure.resourceManagerEndpointUrl 
   *  German Cloud: AzureGermanCloud.resourceManagerEndpointUrl
   *  China Cloud: AzureChina.resourceManagerEndpointUrl
   *  US Government Cloud: AzureUSGovernment.resourceManagerEndpointUrl
   */
  var client = 
    new storageManagement(creds, 
                          subscriptionId, 
                          msrestazure.AzureEnvironment.AzureGermanCloud.resourceManagerEndpointUrl);

  client.storageAccounts.list(function(err, result, req, res) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
  });
});