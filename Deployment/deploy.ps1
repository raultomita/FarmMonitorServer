dotnet publish -r linux-arm -c Release -o Deployment\publish ..\FarmMonitorServer.csproj
docker build -t farmmonitorweb:0.10 .