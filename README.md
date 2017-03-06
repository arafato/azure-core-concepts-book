# Azure Ramp-Up
A curated guide to get going fast on the Azure platform. 
Links, best-practices, explanantions and comments, I wish I had known before 
I started using Azure.

**DRAFT VERSION 0.2** (still early stage, TOC is not final!)

## Table of Contents

* [Fundamental Concepts](#fundamental-concepts)
    * [Basic Terminology](#basic-terminology)
    * [Environments](#environments)
    * [Regions](#regions)
    * [Authentication and Authorization](#authentication-and-authorization)
    * [Azure Resource Manager](#azure-resource-manager)
* [Developer Tooling](#developer-tooling)
* [Open-Source Ecosystem](#open-source-ecosystem)
* [Learning Paths](#learning-paths)
* [Free Resources](#free-resources)
    * [Free eBooks](#free-ebooks)
    * [Webcasts](#webcasts)
    * [Official Whitepapers](#whitepapers)
    * [Recommended Links](#links)
    * [Twitter](#twitter)

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
- Azure Resource Group: A logical container associated with exactly one subscription that holds related resources for an Azure solution
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
>- When using our Azure CLIs and SDKs be sure to configure them accordingly to let 
them talk to the correct environment (see section [Developer Tooling](#developer-tooling) for more information)

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
authentication models, depending on whether you are using ARM or ASM (see section [Azure Resource Manager](#azure-resource-manager)). 
We will focus on ARM which is the current model and the one you should use for every new project.

So let's provide clarity.

#### Short tale about two different authentication schemas
Before we look at the different aspects and services let's quickly define what we mean when we
refer to *Control Plane* and *Data Plane*.

>A **Control Plane** is the set of APIs that allow you to provision and configure a resource.  
>
>A **Data Plane** is the set of APIs that allow you to actually use the resource.

Example: In order to provision a Storage Account, I need to use a different set of APIs compared to
when I want to actually store some data on it. Likewise, I'm using a different set of APIs when I want to
provision an EventHub compared to when I actually push data to it.  

Why is this important? Because Azure provides two different authentication mechanisms.
The one that is based on Azure AD (authentication) and RBAC (authorization) which we will
thoroughly discuss in the subsequent sections, and one that is based on *Shared Keys*.

Every operation on the **Control Plane** needs to be authenticated against Azure AD. Every operation. Period.
Not every operation against the **Data Plane**, however, needs to be also authenticated against Azure AD. Some
services such as [Azure Storage Service](https://docs.microsoft.com/azure/storage/storage-introduction),
[Service Bus](https://docs.microsoft.com/azure/service-bus/), and [Event Hubs](https://docs.microsoft.com/azure/event-hubs/) rely on so-called *Shared Keys*. 

So if you want to provision a Storage Account you will need to authenticate against Azure AD.
In order to read and write data from it (which are operations on the data plane) you are using *Shared Keys*. For a more detailed discussion on this topic with a strong focus on Azure Storage, we recommend the following link: [https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-shared-access-signature-part-1](https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-shared-access-signature-part-1)

Most services on Azure, however, rely on Azure AD and RBAC for managing the Control Plane *and* the Data Plane.

#### Azure Active Directory
Azure Active Directory (Azure AD) is Microsoft’s multi-tenant cloud based directory 
and identity management service (see [https://docs.microsoft.com/azure/active-directory/active-directory-whatis](https://docs.microsoft.com/azure/active-directory/active-directory-whatis)).
In Azure AD, a tenant is representative of an organization. It is a dedicated instance 
of the multi-tenant Azure AD service that an organization receives and owns when it signs up for a 
Microsoft cloud service such as Azure, Microsoft Intune, or Office 365. 
Each Azure AD tenant is distinct and separate from other Azure AD tenants.

An Azure AD tenant has always the following domain assigned **.onmicrosoft.com.* For example, 
if you sign up with your MS consumer account *joe.doe@outlook.com* an Azure AD tenant is 
automatically created for you similiar to `joedoeoutlook.onmicrosoft.com`. A user *Lilli* created in this directory would be referred to as lilli@joedoeoutlook.onmicrosoft.com. Of yourse, if you have your own domain, you can create a CNAME to `joedoeoutlook.onmicrosoft.com` so that users do not need to use these ackward-looking user-name accounts.

A tenant houses the users in a company and the information about them - their passwords, 
user profile data, permissions, and so on. It also contains groups, applications, 
and other information pertaining to an organization and its security.

There are two types of accounts you can use to sign in: a **Microsoft account** 
(formerly known as Microsoft Live ID) and a **work or school account**, which is an 
account stored in Azure AD. There is a federation relationship between between
Azure AD and the Microsoft account consumer identity system. As a result, Azure AD is
able to authenticate "guest" Microsoft accounts as well as "native" Azure AD accounts, assuming that the Azure AD tenant is living in the International Cloud.

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
#### Understanding User and Role Management
First, let's define the terminology because this often leads to confusion.
Generally speaking, an indentity in Azure AD can be of two types: *Administrator* and *User*.

A *User* can only manage Azure resources such as VMs or Storage depending on the according access rights he has been granted through [RBAC](#role-based-access-control). He is not allowed to change any Azure AD properties. 

An *Administrator* can manage properties in Azure AD such as creating, deleting, and modifying users, and also - depending on his granted access rights through [RBAC](#role-based-access-control) - manage Azure resources.

When we talk about administrators in the context of Azure we usually 
do not refer to this *Administrator* type. Instead, people are usually using the
notion of *Azure Active Directory Admin* and *Azure Subscription Admin*. Both are, however, two separate concepts.

Let's examine both of them in more detail.

**Azure Active Directory Admin**  
Also known as *Account Admin* an Azure AD admin (*Administrator* type) can manage properties in the Azure AD like performing 
directory administration tasks using tools such as Azure AD PowerShell or 
Office 365 Admin Center. They have not necessarily access to the associated subscriptions. It is possible but this isn’t required.

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
an Azure AD Admin (Global Administrator role) and an Azure Subscription Admin (see next section). But again, this is not required.

**Azure Subscription Admin**   
An Azure Subscription Admin (can be both an *Administrator* type or *User* type) is an identity that has been assigned 
an owner role on subscription level. 
That means it has has full access to all Azure resources including the right to delegate access to others.
Access Management in Azure is done via *Role-based Access Control (RBAC)* (see [next section](#role-based-access-control))
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

##### Role-based Access Control
Role-based Access Control (RBAC) is all about defining *what* your users are allowed to do.
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
Or if it needs to participate in Authentication Workflows such as OAuth2? 
This is where **Service Principals** come into play. Please refer to both links below in order
to learn more about this topic, and to learn how to set up a service principal.  
- [Application and service principal objects in Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-application-objects)
- [Use portal to create Active Directory application and service principal that can access resources](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal)

Once you have setup a service principal, you can use it to make calls to the Azure APIs (see section [Resource Provider](#resource-provider) for details what we mean by the term *Azure APIs*) from a script or an application, for example. Our SDKs will do much of the heavy lifting regarding authentication, token handling, and so on. See next chapter to learn what's really going on under the hood. 

#### Authentication flow using service principals
Let's briefly look under the hood to better understand what's going on when an SDK authenticates a call. The overall process looks as follows:

1. We need to acquire an OAuth2 bearer token by authenticating ourselves against an identity provider such as Azure AD
2. We use this bearer token to sign our requests to authenticate against the relying party which is the Azure Management API in our case

The token can be acquired with a `POST` call to `https://login.windows.net/<tenantId>/oauth2/token`. The tenant id is your Azure AD tenant that is associated to your subscription, and where you have created a service principal. Think of `https://login.windows.net` as a landing page that forwards you to the correct identity provider depending on whether you are using a work or school account (re-directs you to your Azure AD tenant), or a Microsoft account (re-directs you the Microsoft consumer identity system).

 In our example we want a token that can be used to sign requests against the service management API of the **International Cloud** which is hosted at `https://management.core.windows.net`. We provide this information and our service principal credentials in the body of this request.

After having acquired this token we can add it to the Authorization Header of our HTTP-request against the service management API. See section [Resource Provider](#resource-provider) for a more detailed discussion on how this API works.

We recommend to take a look at this [easy to understand code example](https://github.com/arafato/funcy-azure/blob/master/lib/utils/ARMRest.js#L5-L36) (NodeJS) that walks the path we have just outlined on a high-level.

### Azure Resource Manager
Azure Resource Manager (ARM) is the recommended model for deploying and managing your applications on Azure. 
It is comprised of two parts:
- A set of APIs (accessible via REST, CLI, SDKs, and the Portal) that you use to 
provision and manage your resources. These APIs are offered by so-called **Resource-Providers**  
- A deployment model allowing you to group your resource into so-called **resource-groups**, and hence manage them as a unit, and to declaratively specify your resources in so-called **ARM-Templates** 

Let's take a deeper look into the various aspects.

#### Resource Provider
Think of a resource provider as a service that exposes various APIs for you to create and manage different kinds of Azure resources such as VMs, storage accounts, networking, Stream Analytics jobs, etc. There are a lot of different resource providers available, which you can query in the portal or with our new CLI as follows:
```
$ az provider list
```   
You can find the according output [here](https://github.com/arafato/Azure-RampUp/blob/master/resources/azure-resource-providers.json) for your convenience (last updated March 2nd 2017).

**Gotcha**
>- Our CLIs and SDKs are configured to talk to the *Internation Cloud* environment 
>by default. The above output thus lists only the resource providers available in
>the regions of the **International Cloud**. See section 
>[Developer Tooling](#developer-tooling) for how to configure them to use different
>Azure environments.

Resource providers are organized in namespaces such as `Microsoft.Compute`, `Microsoft.Storage`, or `Microsoft.StreamAnalytics`. We will use the term *namespace* and *resource provider* interchangeably. 

So for example, looking at the namespace `Microsoft.Compute`, you can find multiple *resource types*, each one listed with its available API versions and regions. A *resource type* represents an Azure resource such as a virtual machine, an availability set, a disk, or available locations. A resource type adheres to the following naming convention:

`<Namespace>.resourceType(/resourceType)*`  

That means resource types can be nested. For example: `Microsoft.Compute.virtualMachineScaleSets/virtualMachines/networkInterfaces`

This denotes the resource type of a network interfaces of virtual machines within a scale set.

Each of these resource types provide their own set of REST-full operations and APIs. Depending on the Azure environment (see section [Environments](#environments)) you are using, the management endpoint that hosts these APIs is different. 
For instance, the resource provider APIs of the **Internation Cloud** are hosted at `https://management.azure.com`, the APIs of the **German Cloud** are hosted at `https://management.microsoftazure.de`).

Example: In order to talk to the REST API of a virtual machine named `myVM` in the resource group `myrg` in subscription `8d4dee44-4b28-4e05-9927-3a5d34a42bf5` in the **Internation Cloud** you would call

`https://management.azure.com/subscriptions/8d4dee44-4b28-4e05-9927-3a5d34a42bf5/resourceGroups/myrg/providers/Microsoft.Compute/virtualMachines/myVM?api-version=2016-03-01`

You will find the official Azure REST API reference here: [https://docs.microsoft.com/en-us/rest/api/](https://docs.microsoft.com/en-us/rest/api/)

Note that most Azure service REST APIs have a corresponding client SDK library, which handles much of the client code for you. We will take a more detailed look at that these SDKs, and how to configure them accordingly in the [Developer Tooling](#developer-tooling) section.

#### Resource Groups
A resource group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group. You decide how you want to allocate resources to resource groups based on what makes the most sense for your organization. 

Note, that you need to assing a location to a resource group. The individual resources within a resource group can, however, be deployed into different regions.

Usually, it is recommended to group those resources together that have the same lifecycle (web application servers in one resource group, database servers in another). 

You will find a more detailed discussion on this topic at [https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview#resource-groups](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview#resource-groups)

>**Gotcha**
>- The resource group stores metadata about the resources. Therefore, when you specify a location for the resource group, you are specifying where that metadata is stored. For compliance reasons, you may need to ensure that your data is stored in a particular region

#### ARM Templates
An ARM-Template is a JavaScript Object Notation (JSON) file that defines one or more resources to deploy to a resource group. It also defines the dependencies between the deployed resources. The template can be used to deploy the resources consistently and repeatedly in a so-called *declarative syntax* meaning "Here is what I intend to create". This frees you to think about the sequence of programming commands you have to use.

Using ARM-Templates to provision your resources is the recommended way, and defintely a best-practice. 

ARM-Templates also provide the possibility to use [numeric and string functions](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-functions) increasing their expressiveness, and also a means to split them into smaller units through so-called [Linked Templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-linked-templates).

We recommend the following links to learn more about how to author them, what to consider, and making them world-class ARM-Templates.
- [Authoring Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates)  
A gentle introduction to the structure of ARM-Templates

- [Resource Manager template walkthrough](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-template-walkthrough)  
An end-to-end walkthrough based on a real example  

- [Azure Quickstart ARM-Templates](https://github.com/Azure/azure-quickstart-templates)  
A huge collection of example ARM-Templates that will help you get going fast. Ranging from simple Linux or Windows based VMs, to complex Elastic Search, Cassandra, and Zookeeper setups. 

- [Free Ebook: World-class ARM-Templates - Considerations and Proven Practices](http://download.microsoft.com/download/8/E/1/8E1DBEFA-CECE-4DC9-A813-93520A5D7CFE/World%20Class%20ARM%20Templates%20-%20Considerations%20and%20Proven%20Practices.pdf)   
Over 60 pages full of best-practices and design considerations

##### Round-Trip Engineering
Sometimes you will hear that ARM-Templates support Round-Trip Engineering. This is true in that the internal representation of an Azure resource refers to the same JSON schema as an ARM-Template. You will find the JSON schemas at [https://github.com/Azure/azure-resource-manager-schemas](https://github.com/Azure/azure-resource-manager-schemas)

So in essence this enables you to look at the JSON description of already deployed resources, copy / adapt them to your ARM-Templates, re-deploy, and repeat if needed. Just how can you look at the JSON description of already provisioned resources?
There are multiple ways to do that:
- In the Azure portal you can export the JSON representation of an entire resource group. You'll find that button in the according resource group blade under `Settings - Automation Script`

- In the Azure portal search for `Resource Explorer` under `More Services`

- Visit [https://resources.azure.com](https://resources.azure.com) for an explorer that is similar to the one in the Azure portal, however, providing more features such as calling available REST APIs directly from the web interface  

>*Gotcha*
>- The internal JSON representation of an Azure resource will usually include many more attributes than your original ARM-Template, since the internal representation is explicit. Many attributes have standard values that you often do not explicitly set or are only set and known at provision time such as internal domain name suffixes of your network interface cards. 

##### Tool Support
Writing complex infrastructure setups "by hand" is possible but sometimes people end up writing their own ARM-Template generation tools to speed up things. Up to now, these companies haven't yet released their frameworks and tools. If they do, we will post the according links here.

There is, however, already intellisense support for a wider range of different editors. We will look at them in section [Developer Tooling](#developer-tooling).

Also there is a [free and commercial plugin](http://t4-editor.tangible-engineering.com/T4-Editor-Visual-T4-Editing.html) available for Visual Studio made by a German-based company [Tangible Engineering](http://www.tangible-engineering.com) that allows you to derive your ARM-Templates from a graphical model.

## Developer Tooling
https://docs.microsoft.com/en-us/azure/storage/storage-azure-cli
TODO: Portal, CLIs, SDKs, IDEs and according configuration

- [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/)

## Open Source Ecosystem
This chapter is about third party OSS frameworks and libraries in the context of Azure.
### Compute
- [Serverless Framework](https://serverless.com/)  
The Serverless Framework allows you to deploy auto-scaling, pay-per-execution, event-driven functions to any cloud. 
It currently supports **Microsoft Azure**, AWS Lambda, Apache OpenWhisk, and is expanding to support other cloud providers.

### Storage
- [Azurite](https://github.com/arafato/azurite)  
A lightweight server clone of Azure Blob Storage that simulates most of the
commands supported by it with minimal dependencies. Written in NodeJS.
- [S3Proxy](https://github.com/andrewgaul/s3proxy)  
AWS S3 Proxy written in Java with support for Azure Blob Storage and many other storage backends.

## Learning Paths
The following link points you to an overview listing all available learning paths we
are currently offering for the Azure platform.
Use these learning paths to guide yourself through the documentation for our services so you can start to build effective cloud applications on Azure.  

These learning paths do not encompass all of our services currently available. For many use-cases, however, we think that the most relevant are covered. 

[https://azure.microsoft.com/documentation/learning-paths/](https://azure.microsoft.com/documentation/learning-paths/)

## Free Resources
### Free Ebooks
- [Fundamentals of Azure](https://blogs.msdn.microsoft.com/microsoft_press/2016/09/01/free-ebook-microsoft-azure-essentials-fundamentals-of-azure-second-edition/)
- [Understanding Azure - A Guide for Developers](https://azure.microsoft.com/en-us/campaigns/developer-guide/)

### Webcasts
- [Azure Friday](https://azure.microsoft.com/resources/videos/azure-friday/)  
Join Scott Hanselman every Friday as he engages one-to-one with the engineers who 
build the services that power Microsoft Azure as they demo capabilities, 
answer Scott’s questions and share their insights.
- [Microsoft Virtual Academy - Azure Courses](https://mva.microsoft.com/training-topics/cloud-app-development#!index=2&prod=Microsoft%20Azure&jobf=Developer$IT%20Professional&lang=1033)  
Free Microsoft Azure trainings delivered by experts, ranging from our IaaS to PaaS Offerings such as App Service, Azure Search, Nano-Services with Azure Functions, and Microservice with Docker on Azure Container Service. 

### Whitepapers
- [Securing the Microsoft Cloud](http://download.microsoft.com/download/D/5/E/D5E0E59E-B8BC-4D08-B222-8BE36B233508/Securing_Microsoft_Cloud_Strategy_Brief_.pdf)
- [Azure Security, Privacy, and Compliance](http://download.microsoft.com/download/1/6/0/160216AA-8445-480B-B60F-5C8EC8067FCA/WindowsAzure-SecurityPrivacyCompliance.pdf)
- [Security Management in Microsoft Azure](http://download.microsoft.com/download/7/0/E/70E3858E-8764-4233-A00F-49A3C6C3143C/Security_Management_in_Microsoft_Azure-11062014.pdf)
- [Cloud Operations Excellence and Reliability Strategy Paper](http://download.microsoft.com/download/C/5/5/C55C7170-9AA0-4187-9A78-C5AE85C8161D/Cloud_Infrastructure_Operational_Excellence_and_Reliability_Strategy_Brief.pdf)
- [Leveraging Stored Energy for Handling Power Emergencies](http://download.microsoft.com/download/3/1/9/319FE711-93A7-462D-9681-DB7F2E5875CC/Leveraging_Stored_Energy_for_Handling_Power_Emergencies_White_Paper.pdf)
- [Resilience by Design for Cloud Services](http://download.microsoft.com/download/7/8/7/78716493-0876-4CDF-8595-F5EEE13FD0E1/Resilience_by_Design_for_Cloud_Services_Strategy_Brief.pdf)
- [Information Security Management](http://download.microsoft.com/download/A/0/3/A03FD8F0-6106-4E64-BB26-13C87203A763/Information_Security_Management_System_for_Microsofts_Cloud_Infrastructure.pdf)
- [Where and How your Data is Stored](https://www.microsoft.com/en-us/trustcenter/about/transparency)

### Links
- [Official Azure Blog](https://azure.microsoft.com/blog/)  
Great resource to get informed about all new services and feature announcements
- [Official Azure Documentation](https://docs.microsoft.com/azure)  
Extensive documentation about Azure services, SDKS/Tools, and architectural best-practices
- [Azure Whitepapers by David Chappell](http://www.davidchappell.com/writing/white_papers.php)  
Great high-level and conceptual explanations of Azure-related services and technologies by David Chappell
- [Official Microsoft Azure Github Repository](https://github.com/Azure)  
APIs, SDKs and open source projects from Microsoft Azure (350+ projects) 
- [Azure Networking and ARM FAQ by Igor Pagliai](https://blogs.msdn.microsoft.com/igorpag/2016/07/24/my-personal-azure-faq-on-azure-networking-and-arm/)  
A little bit outdated but still relevant and highly informative FAQ that goes really deep on Networking and ARM topics
- [A curated list of Azure Bookmarks](https://blogs.technet.microsoft.com/tangent_thoughts/2016/02/04/bookmark-this-aka-msazureshortcuts/)  
Links to follow-up Azure articles ranging from topics such as App Service Environments, 
Availability Best-Practices, Blobs, Data Lake Store, all the way up to Security, Trainigs,  
VNETs and WebHooks.

### Twitter
We recommend the following Twitter handles to follow to be first to know if 
something mind-boggling is happening in the Azure universe.
- [Microsoft Azure](https://twitter.com/Azure)  
The official account for Microsoft Account. Follow for news and updates from the #Azure team and community.
- [Corey Sanders](https://twitter.com/CoreySandersWA)  
Director of Program Manager responsible for IaaS and Cloud Services. 
- [Mark Russinovich](https://twitter.com/markrussinovich)  
CTO of Microsoft Azure
- [Scott Guthrie](https://twitter.com/scottgu)  
Runs the Cloud & Enterprise division at Microsoft
