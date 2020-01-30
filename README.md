# Trackletics

## Deployment

To deploy, SSH in to the EC2 server using private key and `git pull origin master` from the server to pull changes in.

## SSL certificate renewal

To install SSL, SSH in to the server and run:

```
sudo certbot --nginx -d api.trackletics.co.uk -d trackletics.co.uk -d www.trackletics.co.uk
```