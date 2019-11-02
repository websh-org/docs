----
title: About
nav: 
  children:
    - milestones
----

## WebShell

The WebShell project aims to define and implement a new secure dataflow and the accompanying APIs for allowing users to use their files in Web apps without authorizing the apps to access the user's file storage. At its core, WebShell consists of a container single-page application which can open remote components (primarily apps and file-system adapters) in sandboxed iframes and communicate with them through HTML5 message channels using the defined APIs. 

The project will build a fully-featured WebShell Desktop container, as well as a minimal WebShell container for testing and easy deployment of single apps. In addition, we will integrate a starter set of editor apps for common file types and a starter set of file system adapters, concentrating primarily on non-commercial web storage solutions and self-hosting.


## Why does this actually matter to end users?

As soon as you sign up with a free email provider or install an operating system, you usually get some cloud storage space. Accessing your data through an online environment has become commonplace, both for business as for individuals. You can share everything from a grocery list with your significant other or even store sensitive documents in the cloud so you can access them from work or on the road. But to be able to have users upload, edit or create files online and pass them around, many cloud services require full access to users data. Like the extensive (and sometimes unreadable) privacy policies you already had to wade through to open your 'free' account, users do not have many options. Either you click yes and the cloud is yours, or you deny the apps all access and are left to your own devices.

The fact that you want to access your data online, does not mean you need to store it in a place where the provider requires you to hand over the keys. Especially when it is unclear who can use the keys to look around in your documents, or analyze sensitive documents simply for the sake of personally profiled advertising, which quite certainly is not what you signed up for. You would want to know where your data is, lock the doors to it yourself yourself and keep the keys somewhere safe (without any intricate key management or cryptographic busywork).

WebShell combines these features of complete data control and user-friendly data access in an environment you are already familiar with: an online version of your desktop. Just like when you start up your laptop or home computer, you start up WebShell and go through your files, open an application to edit something, and switch it off again. Instead of these apps requiring full access to your data that is hosted somewhere in the world, you can self-host your data vault (or choose a hosting service you know and trust) and apps never operate on your files directly. The web desktop securely opens and saves your files and only with your express permission.

This project is funded through the NGI0 PET Fund, a fund established by NLnet with financial support from the European Commission's Next Generation Internet programme, under the aegis of DG Communications Networks, Content and Technology under grant agreement No 825310. Applications are still open, you can apply today.