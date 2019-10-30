----
title: @websh/remote-slave-port
toc:
  title: remote-slave-port
----


**[https://github.com/websh-org/remote-slave-port](https://github.com/websh-org/remote-slave-port)**

Slave port for async cross-iframe messaging. Load this in an iframe.

See [remote-master-port](remote-master-port) for the other side of the channel (in the parent window).

The master port must innitiate the connection. 

## Synopsis
````bash
$ npm install @websh/remote-slave-port
````

````js
import { RemoteSlavePort } from "@websh/remote-slave-port";

// the master port in the parent window must use 
// the same channelId to establish a channel
const channelId = "my-channel"; 

const mySlavePort = new RemoteSlavePort(channelId);
````

## Methods

All methods return the MasterSlavePort object, so you can chain method calls.

### `.manifest( Object manifest )`
Register the slave's manifest. This will be sent to the master
on connection.

### `.command( String command, Function( Object args ) fn )`
Register a command to be called from the master port.
Any value returned from the function will be sent back to the master port.
The function can be async.

### `.trigger( String event, Object data )`
Trigger an event that will be sent to the master port
