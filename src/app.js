const log = false;

function setFavicon(url) {
	  let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
	  link.type = 'image/x-icon';
	  link.rel = 'shortcut icon';
	  link.href = url;
	  document.getElementsByTagName('head')[0].appendChild(link);
	}

const showCustomPage = async opts => {
	log && console.debug( '[showCustomPage] init', opts );

	if (opts.theme === 'theme') {
		let browserNTPBackground;
		try {
			browserNTPBackground = await browser.theme.getCurrent().then(res => res.colors.ntp_background);
		} catch {
			browserNTPBackground = "#F9F9FB"
		}

		document.body.style.backgroundColor = browserNTPBackground;
	}

	if ( opts.theme === 'light' ) {
		document.body.classList.add( 't-light' );
	}

	if ( opts.theme === 'dark' ) {
		document.body.classList.add( 't-dark' );
	}

	if ( opts.theme === 'custom' && opts.customBackgroundColor && opts.customBackgroundColor.length !== 0 ) {
		document.body.style.backgroundColor = opts.customBackgroundColor;
	}

	if ( opts.customNewTabTitle ) {
		document.title = opts.customNewTabTitle;
	}

	// no tab URL set, do nothing
	if ( !opts.customNewTabUrl || opts.customNewTabUrl.length === 0 ) {
		log && console.debug( '[showCustomPage] no tab url set' );
		return;
	}

	document.documentElement.classList.add( 'cntp-has-loaded' );

	/*
	The `type="content"` attribute is used for security purposes to avoid
	giving the iframe a privileged context that could be used to
	access browser (cookies, history, etc) or user files.
	See https://mdn.io/Displaying_web_content_in_an_extension_without_security_issues
	*/
	const iframe = document.createElement( 'iframe' );
	iframe.id = 'cntp-iframe';
	iframe.classList.add( 'cntp-iframe' );
	iframe.setAttribute( 'type', 'content' );
	iframe.setAttribute( 'allow', 'geolocation' );
	iframe.onload = _ => document.body.classList.remove( 'is-loading' );
	iframe.src = opts.customNewTabUrl;

	document.body.append( iframe );

	setFavicon(opts.customFavicon);
};

const init = _ => {
	browser.storage.sync.get([ 'customNewTabUrl', 'customNewTabTitle', 'customFavicon', 'theme', 'customBackgroundColor' ])
		.then( showCustomPage );
};

init();