function parseUplink(device, payload)
{
	 // Payload is json
    var data = payload.asJsonObject();
    env.log(data);
    if (data.Type == "data")
    {
        
        var ep = device.endpoints.byAddress("1");
        if (ep != null && data.isOn != null && data.dimValue != null)
        {
            env.log("update!");
            ep.updateDimmerStatus(data.isOn, data.dimValue);
        }
        else {
            env.log ("valores nules recibidos");
        }

     }

    if (data.Type == "response")
    {
        if (data.Success) 
        {
            device.respondCommand(data.CommandId, commandResponseType.success);
        }
        else 
        {
            device.respondCommand(data.CommandId, commandResponseType.error, data.ErrorMessage, data.ErrorCode);
        }
    }

}

function buildDownlink(device, endpoint, command, payload) 
{ 
	// This function allows you to convert a command from the platform 
	// into a payload to be sent to the device.
	// Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device to which the command will
	//   be sent. 
	// - endpoint: endpoint object representing the endpoint to which the 
	//   command will be sent. May be null if the command is to be sent to 
	//   the device, and not to an individual endpoint within the device.
	// - command: object containing the command that needs to be sent. More
	//   information at https://wiki.cloud.studio/page/1195.

	// This example is written assuming a device that contains a single endpoint, 
	// of type appliance, that can be turned on, off, and toggled. 
	// It is assumed that a single byte must be sent in the payload, 
	// which indicates the type of operation.

    payload.buildResult = downlinkBuildResult.ok;
    
    switch (command.type) {
		case commandType.onOff:
			switch (command.onOff.type) {
				case onOffCommandType.turnOn:
                    var obj = { 
                        CommandId: command.commandId,
                        Command: "TurnOn"
                    };
                    payload.setAsJsonObject(obj);
                    payload.requiresResponse = true;
					break;
				case onOffCommandType.turnOff:
					var obj = { 
                        CommandId: command.commandId,
                        Command: "TurnOff"

                    };
                    payload.setAsJsonObject(obj);
                    payload.requiresResponse = true;
					break;
				default:
					payload.buildResult = downlinkBuildResult.unsupported;
					break;
			}
			break;
        case commandType.dimmer:
            var obj = { 
                CommandId: command.commandId,
                Command: "SetLevel",
                DimValue: command.dimmer.level
            };
            payload.setAsJsonObject(obj);
            payload.requiresResponse = true;
			break;

		default:
			payload.buildResult = downlinkBuildResult.unsupported;
			break;
	} 
    
    

}