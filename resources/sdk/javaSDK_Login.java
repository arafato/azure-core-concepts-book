
/*
 * SUPPORTED AZURE ENVIRONMENT NAMES
 * 
 * International Cloud (default): AZURE
 * German Cloud: AZURE_GERMANY
 * China Cloud: AZURE_CHINA
 * US Government Cloud: AZURE_US_GOVERNMENT 
 *
 * 
 *  This sample points to Azure German Cloud
 *
 */

//Service Principal login

ApplicationTokenCredentials credentials = new ApplicationTokenCredentials(
    "<client-id>",
    "contoso.com",
    "<client-secret>",
    AzureEnvironment.AZURE_GERMANY);
Azure.Authenticated azureAuth = Azure.authenticate(credentials);
// blocking call
Azure azure = azureAuth.withDefaultSubscription();
// non-blocking
Azure azure2 = azureAuth.withSubscription("<subscription-id>");




//Azure Active Directory login

UserTokenCredentials creds = new UserTokenCredentials(
    "<client-id>",
    "contoso.com",
    "<username>@contoso.com",
    "<password>",
    AzureEnvironment.AZURE_GERMANY);
Azure.Authenticated azureAuth = Azure.authenticate(creds);