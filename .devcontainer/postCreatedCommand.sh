#!/bin/bash

echo "node" | sudo -S chown node /workspace/node_modules && sudo -S chmod 777 /workspace/node_modules
echo "node" | sudo -S chown node /workspace/.next && sudo -S chmod 777 /workspace/.next
echo "node" | sudo -S chown node /workspace/.server && sudo -S chmod 777 /workspace/.server
