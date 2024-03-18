envs:


`ZEEBE_GATEWAY_ADDRESS`  zeebe gateway addres. for example zeebe:26500

`SERVICE_TASK_TYPE`  service task type. for example scriptJs


```
version: "3.9"

services:
  script-javascript:
    container_name: 'camunda-script-javascript'
    image: 'imirsaburov/camunda-script-javascript:${VERSION:-1.0.1}'
    environment:
      ZEEBE_GATEWAY_ADDRESS: zeebe:26500
      SERVICE_TASK_TYPE: 'scriptJs'
```