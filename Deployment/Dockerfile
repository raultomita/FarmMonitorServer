#Start from scratch
FROM resin/rpi-raspbian
RUN apt-get update && apt-get install curl libunwind8 gettext libicu-dev
RUN curl -sSL -o dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Runtime/master/dotnet-linux-arm.latest.tar.gz
RUN mkdir -p /opt/dotnet && tar zxf dotnet.tar.gz -C /opt/dotnet
RUN ln -s /opt/dotnet/dotnet /usr/local/bin
WORKDIR app
EXPOSE 5000
COPY publish .
CMD ["dotnet", "FarmMonitorServer.dll"]
