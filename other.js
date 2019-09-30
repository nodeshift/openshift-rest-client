  let kubeconfig = settings.config;
  if (kubeconfig) {
    // A config is being passed in.  Check if it is an object
    if (typeof kubeconfig === 'object' && kubeconfig.auth) {
      // Check for the auth username password
      if ('user' in kubeconfig.auth || 'username' in kubeconfig.auth) {
        // They are trying the basic auth.
        // Get the access token using the username and password
        const accessToken = await getTokenFromBasicAuth({ insecureSkipTlsVerify: settings.insecureSkipTlsVerify, url: kubeconfig.url, user: kubeconfig.username || kubeconfig.user, password: kubeconfig.password || kubeconfig.pass });

        kubeconfig = {
          url: kubeconfig.url,
          auth: {
            bearer: accessToken
          },
          insecureSkipTlsVerify: 'insecureSkipTlsVerify' in settings ? Boolean(settings.insecureSkipTlsVerify) : false
        };
      }
    }
  }

  console.log(kubeconfig);

  // TODO: need to be able to pass in the config object here
  const client = new Client({ config: kubeconfig || config.fromKubeconfig(), spec, getNames: getNames });
  return client;
