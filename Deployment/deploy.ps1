rm publish -r
dotnet publish -r linux-arm -c Release -o Deployment\publish ..\FarmMonitorServer.csproj
docker container stop farmmonitorweb
docker container rm farmmonitorweb
docker build -t farmmonitorweb:latest .
docker run --restart unless-stopped -p 80:5000  --name farmmonitorweb farmmonitorweb:latest