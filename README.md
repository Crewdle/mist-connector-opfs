# Crewdle Mist OPFS Connector

## Introduction

The Crewdle Mist OPFS Connector is designed to facilitate the storage of objects from your Object Storage service directly into OPFS (Object Persistent File System). It simplifies the process of transferring and managing data by providing a seamless connection between your storage service and OPFS, ensuring efficient and reliable data handling without requiring complex setup or additional middleware. This connector is ideal for those looking to leverage OPFS's capabilities for robust and scalable object storage solutions.

## Getting Started

Before diving in, ensure you have installed the [Crewdle Mist SDK](https://www.npmjs.com/package/@crewdle/web-sdk).

## Installation

```bash
npm install @crewdle/mist-connector-opfs
```

## Usage

```TypeScript
import { OPFSObjectStoreConnector } from '@crewdle/mist-connector-opfs';

// Create a new SDK instance
const sdk = await SDK.getInstance('[VENDOR ID]', '[ACCESS TOKEN]', {
  objectStorageConnector: OPFSObjectStoreConnector,
});
```

## Need Help?

Reach out to support@crewdle.com or raise an issue in our repository for any assistance.

## Join Our Community

For an engaging discussion about your specific use cases or to connect with fellow developers, we invite you to join our Discord community. Follow this link to become a part of our vibrant group: [Join us on Discord](https://discord.gg/XJ3scBYX).
