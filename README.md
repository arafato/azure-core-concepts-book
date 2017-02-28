# Azure Ramp-Up
A curated guide to get going fast on the Azure platform. 
Links, best-practices, explanantions and comments, I wish I had known before 
when I started to use Azure.

## Table of Contents

  * [Fundamental Concepts](#fundamental-concepts)
    * [Basic Terminology](#basic-terminology)
    * [Environments](#environments)
    * [Regions](#regions)
    * [Authentication and Authorization](#authentication-and-authorization)
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

**Gotcha**
>- The *Azure Cloud* environment is the only one which has a trust relationship with the
>Microsoft consumer identity system. This lets you signup and login with a Microsoft account
>(formely known as LiveID). This is also the reason why you cannot use a Microsoft account to
>signup and login into the other Cloud environments since these do *not* have a trust relationship
>with the Microsoft consumer identity system due to their restricted privacy and data regulations.

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
>- When deploying new resources onto Azure you can select the region to deploy to, however, 
>as of now you cannot choose amongst the individual data-centers available in that region. 
>- Availability of Azure services depend on the region. Not every service that is *Generally Available* is available in every region.
>Please check services available by region at [https://azure.microsoft.com/regions/services/](https://azure.microsoft.com/regions/services/)

### Authentication and Authorization
Understanding Authentication in Azure can be complicated at the beginning. Most users
are confused about all the different pieces and terminologies such as *Azure AD, Tenant ID,
Account Owner, Subscription Owner, Subscription Admin, Directory Admin, Co-Admin, RBAC* etc. 
coming together. It doesn't help neither that
terms are used inconsistently throughout the web, and that Azure has two different
authentication models, depending on whether you are using ARM or ASM (see subsequent section). 
We will focus on ARM which is the current model and the one you should use for every new project.

So let's provide clarity.

#### Control Plane vs Data Plane
Before we look at the different aspects and services let's quickly define what we mean when we
refer to *Control Plane* and *Data Plane*.

A **Control Plane** is the set of APIs that allow you to provision and configure a resource.  
A **Data Plane** is the set of APIs that allow you to actually use the resource.

Example: In order to provision a Storage Account, I need to use a different set of APIs compared to
when I want to actually store some data on it. Likewise, I'm using a different set of APIs when I want to
provision an EventHub compared to when I actually push data to it.  

Why is this important? Because Azure provides two different authentication mechanisms.
The one that is based on Azure AD (authentication) and RBAC (authorization) which we will
thoroughly discuss in the subsequent sections, and one that is based on *Shared Keys*.

Every operation on the **Control Plane** needs to be authenticated against Azure AD. However, 
not every operation against the **Data Plane** needs to be also authenitcated against Azure AD. Some
services such as [Azure Storage Service](https://docs.microsoft.com/azure/storage/storage-introduction),
[Service Bus](https://docs.microsoft.com/azure/service-bus/), and [Event Hubs](https://docs.microsoft.com/azure/event-hubs/) rely on so-called *Shared Keys*. 

So if you want to provision a Storage Account you will need to authenticate against Azure AD.
In order to read and write data from it (which are operations on the data plane) you are using shared keys. 

Most service on Azure, however, rely on Azure AD and RBAC for managing the Control Plane 
*and* the Data Plane.

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
>- Account Overlap: It is not possible anymore to create a new personal Microsoft 
>account using a work/school email address, when the email domain is configured in Azure AD.
>See [https://blogs.technet.microsoft.com/enterprisemobility/2016/09/15/cleaning-up-the-azure-ad-and-microsoft-account-overlap/](https://blogs.technet.microsoft.com/enterprisemobility/2016/09/15/cleaning-up-the-azure-ad-and-microsoft-account-overlap/) for details

#### Subscriptions
An Azure subscription is just a manageable group of resources for the accounting department.
Every Azure subscription has a trust relationship with an Azure AD instance. 
This means that it trusts that directory to authenticate users, services, and devices. 
Multiple subscriptions can trust the same directory, but a subscription trusts one and only
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
Generally speaking, an indentity in Azure AD can be of two types: *Administrator* and *User*.
An *Administrator* can manage properties in Azure AD such as creating users, while a *User* 
can only manage Azure resources such as VMs or Storage (depending on the according access rights). 

When we talk about administrators in the context of Azure, however, we usually 
do not refer to this *Administrator* type. Instead, people are usually using the
notion of *Azure Active Directory Admin* and *Azure Subscription Admin*.

Let's examine both of them in more detail.

**Azure Active Directory Admin**  
Also known as *Account Admin* an Azure AD admin (*Administrator* type) can manage properties in the Azure AD like performing 
directory administration tasks using tools such as Azure AD PowerShell or 
Office 365 Admin Center. They have not necessarily access to the associated subscriptions.
It is possible but this isn’t required.

An Azure AD Admin is always assigned a specific administrator role. To have access to all 
administrative features of Azure AD, an administrator needs to be assigned the so-called
*Global Administrator* role. Only those can also assign other administrator roles. 
Administrator that have not been assigned the *Global Administrator* role, are usually referred
to as *Limited Administrators*. Please see [https://docs.microsoft.com/en-us/azure/active-directory/active-directory-assign-admin-roles](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-assign-admin-roles) for
a detailed discussion and overview of the individual roles.  
Much of these roles, however, are not really relevant in the context of Azure. Note, that
Azure AD is used amongst a lot of different Microsoft products such as Office365, Dynamics365, 
Skype for Business, Intune, and many more. This is why there are so many more roles.
The ones that are usually relevant in the context of Azure are
- Global Administrator
- User account administrator
 
Typically, the account you are using for the initial sign up for an Azure account, is both
an Azure AD Admin (Global Administrator role) and an Azure Subscription Admin (see next section). But again, 
this is not required.

**Azure Subscription Admin**   
An Azure Subscription Admin (can be both an *Administrator* type or *User* type) is an identity that has been assigned 
an owner role on subscription level. 
That means it has has full access to all Azure resources including the right to delegate access to others.
Access Management in Azure is done via *Role-based Access Control (RBAC)* (see next section)
which lets you assign appropriate roles to users, groups, and applications at different scopes
such as subscription, resource groups, or a single subscription.

In the old ASM world the equivalent role is often referred to as *Service Administrator* or
*Co-Admin*, and unfortunately they are still used in the ARM world. Do not use them since 
they do not provide the same power and flexibility as the new concepts discussed here. 
In particular, they are lacking the entire *RBAC* functionality and force you to use the classic portal
if you need to make any changes.

So in essence an Azure Subscription Admin is only a specialization of a regular *User* type.
That is, someone with an *Owner* role at subscription level. We could also think about
an identity with only *Contributor* role on a certain resource group scope. From a conceptual
point of view both users do not differ except for their assigned roles and rights.

Now what exactly is this RBAC, Owner, and Contributor role all about? Next!

##### Role-based Access Control (RBAC)
RBAC is all about defining *what* your users are allowed to do.
For this purpose it provides built-in roles that you can use to assign to a user, groups, and
applications.  
Azure RBAC has three basic roles that apply to all resource types:
- **Owner** has full access to all resources including the right to delegate access to others.
- **Contributor** can create and manage all types of Azure resources but can’t grant access to others.
- **Reader** can view existing Azure resources.

The rest of the RBAC roles in Azure allow management of specific Azure resources. 
For example, the **Virtual Machine Contributor** role allows the user to create and 
manage virtual machines. It does not give them access to the virtual network or the 
subnet that the virtual machine connects to.    
A more detailed discussion can be found at [https://docs.microsoft.com/azure/active-directory/role-based-access-control-what-is](https://docs.microsoft.com/en-gb/azure/active-directory/role-based-access-control-what-is)

If you're looking to define your own roles for even more control, see how to build [Custom roles in Azure RBAC](https://docs.microsoft.com/azure/active-directory/role-based-access-control-custom-roles).
Note, however, that custom roles are currently supported only via [Powershell](https://docs.microsoft.com/azure/active-directory/role-based-access-control-manage-access-powershell), 
the [Azure CLI](https://docs.microsoft.com/azure/active-directory/role-based-access-control-manage-access-azure-cli),
and the [REST API](https://docs.microsoft.com/azure/active-directory/role-based-access-control-manage-access-rest).

Now let's talk about **Groups** and **Group Owners**.  
A group in the RBAC-context provide a means to group users, and let them utilize the privileged access it grants.
From a conceptual point of view, they are really similiar to GNU/Linux groups for access control. 
What is interesting is, that you can assign a so-called **Group Owner** to a particular group. 
The membership of the group is now managed by the group owner. 
The resource owner effectively delegates the permission to assign users to the subscription, resource group, or resource 
to the owner of the group.  
A detailed discussion of this topic can be found at [https://docs.microsoft.com/azure/active-directory/active-directory-manage-groups](https://docs.microsoft.com/azure/active-directory/active-directory-manage-groups).

#### Authenticating an app or a script via Service Principals
Until now we only talked about authenticating real users, human beings. But what if your script
or application needs to authenticate itself (via certificates) in order to access Azure resources? 
This is where **Service Principals** come into play. Please refer to both links below in order
to learn more about this topic, and to learn how to set up a service principal.  
- [Application and service principal objects in Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-application-objects)
- [Use portal to create Active Directory application and service principal that can access resources](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal)

### Deployment Models 
ARM vs ASM
https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview

### Developer Tooling
TODO: Portal, CLIs, SDKs, IDEs and according configuration