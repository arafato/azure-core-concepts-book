# Azure Ramp-Up
A curated guide to get going fast on the Azure platform. 
Links, best-practices, explanantions and comments, I wish I had known before 
when I started to use Azure.

## Table of Contents

  * [Fundamental Concepts](#fundamental-concepts)
    * [Basic Terminology](#basic-terminology)
    * [Environments](#environments)
    * [Regions](#regions)
    * [Authentication](#authentication)
    * [Deployment Models](#deployment-models)
    * [Developer Tooling](#developer-tooling)

## Fundamental Concepts
This chapter is about the the foundational building blocks of the Azure platform. 
This chapter will help you understand the basic terminology and concepts you will
need every day when working with Microsoft Azure. 
### Basic Terminology
- Azure Portal: A graphical user interface to manage and operate your cloud-based environment.
- Classic Portal: The old graphical user interface using the ASM deployment model (deprecated)
- Azure Environment: A strictly isolated part of the Azure Cloud Platform
- Azure Geography: A defined area of the world that contains at least one Azure Region 
- Azure region: A geographical location within a geography containing one or more Azure data-centers
- Azure Subscription: A manageable group of resources for the accounting department
- Microsoft account: A consumer account that has been created via [https://signup.live.com/](https://signup.live.com/)
- Work or school account: An account that has been created in an (Azure) Active Directory. Includes Office365 accounts.
- Azure Resource Manager (ARM): The modern deployment model in Azure.
- Azure Service Manager (classic): The classic deployment model. Do not use for new projects. 
- Azure Resource:  A manageable item that is available through Azure. Some common resources are a virtual machine, storage account, web app, database, and virtual network, but there are many more.

### Environments
Azure is comprised of currently four different so-called *environments* that are strictly isolated from each other. 
*Strictly isolated* means:
- They are operated and managed through different endpoints (same API interfaces, though)
- Their authentification mechanisms (Azure Active Directory) do not have a trust-relationship with each other. Thus, environments 
do not provide a single sign-on experience amongst each other  
- They are managed through distinct graphical user interfaces (Azure speak: portals) since a portal also needs to authenticate and operate against the different management and service endpoints
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
Frankfurt, the other one in Magdeburg. Operated by T-Systems International GmbH, a 
subsidiary of Deutsche Telekom. Serves as trustee, protecting disclosure of data
to third parties except as the customer directs or as required by German law. 
Even Microsoft does not have access to customer data or the data centres 
without approval from and supervision by the German data trustee.
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

### Regions
The Azure platform is currently comprised of 34 regions world-wide.
A region is a geographical location of a cluster of Azure data-centers. Each region is assigned to one and only one environment.
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
Understanding Authentication in Azure can be complicated at the beginning. Most users
are confused about all the different pieces and terminologies such as *Azure AD, Tenant ID,
Account Owner, Subscription Owner, Subscription Admin, Directory Admin, Co-Admin, RBAC* etc. 
coming together. It doesn't help neither that
terms are used inconsistently throughout the web, and that Azure has two different
authentication models, depending on whether you are using ARM or ASM (see subsequent section). 
We will focus on ARM which is the current model and the one you should use for every new project.

So let's provide clarity.

#### Azure Active Directory
Azure Active Directory (Azure AD) is Microsoft’s multi-tenant cloud based directory 
and identity management service (see [https://docs.microsoft.com/azure/active-directory/active-directory-whatis](https://docs.microsoft.com/azure/active-directory/active-directory-whatis)).
In Azure AD, a tenant is representative of an organization. It is a dedicated instance 
of the Azure AD service that an organization receives and owns when it signs up for a 
Microsoft cloud service such as Azure, Microsoft Intune, or Office 365. 
Each Azure AD tenant is distinct and separate from other Azure AD tenants.

An Azure AD tenant has always the following domain assigned **.onmicrosoft.com.* For example, 
if you sign up with your MS consumer account *joe.doe@outlook.com* and Azure AD tenant is 
automatically created for you similiar to *joedoeoutlook.onmicrosoft.com*.

A tenant houses the users in a company and the information about them - their passwords, 
user profile data, permissions, and so on. It also contains groups, applications, 
and other information pertaining to an organization and its security.

There are two types of accounts you can use to sign in: a Microsoft account 
(formerly known as Microsoft Live ID) and a work or school account, which is an 
account stored in Azure AD. There is a federation relationship between between
Azure AD and the Microsoft account consumer identity system. As a result, Azure AD is
able to authenticate "guest" Microsoft accounts as well as "native" Azure AD accounts.

##### Gotchas
- Account Overlap: It is not possible anymore to create a new personal Microsoft 
account using a work/school email address, when the email domain is configured in Azure AD.
See [https://blogs.technet.microsoft.com/enterprisemobility/2016/09/15/cleaning-up-the-azure-ad-and-microsoft-account-overlap/](https://blogs.technet.microsoft.com/enterprisemobility/2016/09/15/cleaning-up-the-azure-ad-and-microsoft-account-overlap/) for details

#### Subscriptions
Every Azure subscription has a trust relationship with an Azure AD instance. 
This means that it trusts that directory to authenticate users, services, and devices. 
Multiple subscriptions can trust the same directory, but a subscription trusts only
one directory. 

This trust relationship that a subscription has with a directory is unlike the relationship
that a subscription has with all other resources in Azure (websites, databases, and so on),
which are more like child resources of a subscription. 
If a subscription expires, then access to those other resources associated with 
the subscription also stops. But the directory remains in Azure, and you can 
associate another subscription with that directory and continue to manage the 
directory users.

Please see [https://docs.microsoft.com/en-us/azure/active-directory/active-directory-how-subscriptions-associated-directory](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-how-subscriptions-associated-directory) for a more detailed discussion.
#### Understanding User and Roles Management
First, let's define the terminology and roles because this often leads to confusion.
Generally speaking, an indentity in Azure AD can be in one of two roles: *Administrator* and *User*.
*Administrator* roles can manage properties in Azure AD, while *User* roles can only manage Azure
resources such as VMs or Storage (depending on the according access rights). 

When we talk about administrator roles in the context of Azure, however, we usually 
do not refer to this broader *Administrator* role. Instead, people are usually using the
notion of *Azure Active Directory Admin* and *Azure Subscription Admin*.

**Azure Active Directory Admin**  
Azure AD admins (*Administrator* role) can manage properties in the Azure AD like performing 
directory administration tasks using tools such as Azure AD PowerShell or 
Office 365 Admin Center. They have not necessarily access to the associated subscriptions.
It is possible but this isn’t required. 


Typically, the account you are using for the initial sign up for an Azure account, is both
an Azure AD Admin and an Azure Subscription Admin (see next section). But again, 
this is not required.

This role is also sometimes referred to as *Account Admin*.

**Azure Subscription Admin**   
An Azure Subscription Admin (can be both in Azure AD *Administrator* role or *User* role) is an identity that has an owner role on subscription level. 
That means it has has full access to all Azure resources including the right to delegate access to others.
Access Management in Azure is done via *Role-based Access Control (RBAC)* (see next section)
which lets you assign appropriate roles to users, groups, and applications at different scopes
such as subscription, resource groups, or a single subscription.

In the old ASM world the equivalent role is often referred to as *Service Administrator* or
*Co-Admin*, and unfortunately they are still used in the ARM world. Do not use them since 
they do not provide the same power and flexibility as the new concepts discussed here. 
In particular, they are lacking the entire *RBAC* functionality and force you to use the old portal
if you need to make any changes.

So in essence an Azure Subscription Admin is only a specialization of a regular *User* role.
That is, someone with an *Owner* role at subscription level. We could also think about
an identity with only *Contributor* role on a certain resource group scope. From a conceptual
point of view both users do not differ except for their assigned roles and rights.

##### Role-based Access Control (RBAC)
[https://docs.microsoft.com/en-gb/azure/active-directory/role-based-access-control-what-is](https://docs.microsoft.com/en-gb/azure/active-directory/role-based-access-control-what-is)

##### Different Types of Accounts  
- Consumer Accounts
- Azure AD Accounts
- Guest Accounts

### Deployment Models 
ARM vs ASM
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview

### Developer Tooling
TODO: Portal, CLIs, SDKs, IDEs and according configuration