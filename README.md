# Azure Ramp-Up
A curated guide to get going fast on the Azure platform. 
Links, best-practices, explanantions and comments, I wish I had known when I started to use Azure.

## Basics
This chapter is about the the foundational building blocks of the Azure platform. Do not start anything serious 
before you have gone through all of the subsequent sections.
### Basic Terminology
- Azure Portal: A graphical user interface to manage and operate your cloud-based environment.
- Azure Environment: A strictly isolated part of the Azure Cloud Platform
- Azure Geography: A defined area of the world that contains at least one Azure Region 
- Azure region: A geographical location within a geography containing one or more Azure data-centers
- Microsoft account: A consumer account that has been created via [https://signup.live.com/](https://signup.live.com/)
- Work or school account: An account that has been created in an Azure Active Directory. Includes Office365 accounts.
- Azure Resource Manager (ARM): The modern deployment model in Azure.
- Azure Service Manager (classic): The classic deployment model. Do not use for new projects. 
- Azure Resource:  A manageable item that is available through Azure. Some common resources are a virtual machine, storage account, web app, database, and virtual network, but there are many more.

### Environments
Azure is comprised of currently four different so-called *environments* that are strictly isolated from each other. 
Strictly isolated means:
- They are operated and managed through different endpoints (same API interfaces, though)
- Their authentification mechanisms (Azure Active Directory) do not have a trust-relationship with each other. Thus, environments 
do not provide a single sign-on experience amongst each other  
- They are managed through distinct graphical user interfaces (Azure speak: portals) since a portal also needs to authenticate and operate against different endpoints)
- When using our Azure CLIs and SDKs be sure to configure them accordingly to let them talk to the correct environment (refer to TBD)

Azure currently provides the following environments:
- Azure Cloud
- Azure German Cloud
- Azure US Government
- Azure China Cloud

#### Azure Cloud
Also known as the International Cloud. Currently comprised of 30 regions world-wide.

Sign Up: [https://azure.microsoft.com/free/](https://azure.microsoft.com/free/) 

Portal: [https://portal.microsoft.com](https://portal.microsoft.com) 

#### Azure German Cloud
Also known as *Microsoft Cloud Deutschland*. Comprised of 2 regions, one located in 
Frankfurt, the other one in Magdeburg.
More information at [https://azure.microsoft.com/overview/clouds/germany](https://azure.microsoft.com/overview/clouds/germany)

Sign Up: [https://azure.microsoft.com/free/germany/](https://azure.microsoft.com/free/germany/)

Portal: [https://portal.microsoftazure.de](https://portal.microsoftazure.de)

#### Azure China Cloud
Azure China Cloud is available through a unique partnership between Microsoft and 21Vianet, one of the country’s largest Internet providers.

Sign Up: [https://www.windowsazure.cn](https://www.windowsazure.cn)

Portal: [https://portal.azure.cn/](https://portal.azure.cn/)

#### Azure Gov Cloud
Also known as *Microsoft Azure Government Cloud*. Comprised of 4 regions in USA. No public registration.
More information at [https://azure.microsoft.com/overview/clouds/government/](https://azure.microsoft.com/overview/clouds/government/) 

Trial Registration Form: [https://azuregov.microsoft.com/trial/azuregovtrial](https://azuregov.microsoft.com/trial/azuregovtrial)

### Azure Regions
The Azure platform is currently comprised of 34 regions world-wide.
A region is a geographical location of a cluster of Azure data-centers. 
More information at [https://azure.microsoft.com/regions/](https://azure.microsoft.com/regions/)

Azure regions are organized as so-called *Paired Regions*. Each Azure region is paired with another region within the same geography, together making a regional pair. 
The exception is Brazil South, which is paired with a region outside its geography.
More information at [https://docs.microsoft.com/azure/best-practices-availability-paired-regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions)
#### Gotchas
- When deploying new resources onto Azure you can select the region to deploy to, however, 
as of now you cannot choose amongst the individual data-centers available in that region. 
- Availability of Azure services depend on the region. Not every service that is *Generally Available* is available in every region.
Please check services available by region at [https://azure.microsoft.com/regions/services/](https://azure.microsoft.com/regions/services/)

### Authentication
TODO

### Deployment Models 
ARM vs ASM
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview

### Developer Tooling
TODO: CLIs, SDKs, IDEs and according configuration