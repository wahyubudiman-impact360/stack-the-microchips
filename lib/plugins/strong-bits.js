ig.module('plugins.strong-bits')
    .requires(
        'plugins.handlers.api-handler'
    )
    .defines(function() {
        ig.StrongBitsAPI = ig.ApiHandler.inject({
            NAME: "Strong Bits API",
            VERSION: "1.0.0",

            settings: {
                logStyles: {
                    log: "color: #F8A553; background-color: #222222;",
                    trace: "color: #F8A553; background-color: #222222;"
                },
                adRequestTimeout: {
                    "interstitial": 15,
                    "rewardedvideo": 15
                },
                adProcessTimeout: {
                    "interstitial": 30,
                    "rewardedvideo": 30
                },
                adCooldownTimeout: {
                    "interstitial": 60,
                    "rewardedvideo": 3
                },
                callback: {
                    onload: function() {}.bind(this),
                    pauseGame: function() {}.bind(this),
                    resumeGame: function() {}.bind(this)
                }
            },

            parameters: {
                properties: {
                    "verbose": {
                        "type": "string",
                        "default": null
                    },
                    "test": {
                        "type": "string",
                        "default": null
                    },
                    "publisher-id": {
                        "type": "string",
                        "default": null
                    },
                    "ad-channel": {
                        "type": "string",
                        "default": null
                    }
                }
            },

            googleAfg: {
                enabled: false,
                loaded: false,
                url: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
                publisherId: "ca-pub-9233878085988971",
                instance: null,
                adSlots: {
                    "interstitial": null,
                    "rewardedvideo": null
                }
            },

            googleAnalytics: {
                enabled: true,
                loaded: false,
                gtag: {
                    id: "G-PP38DN2E4D",
                    url: "https://www.googletagmanager.com/gtag/js"
                }
            },

            adTypes: {
                "preroll": "interstitial",
                "midroll": "interstitial",
                "start": "interstitial",
                "pause": "interstitial",
                "browse": "interstitial",
                "interstitial": "interstitial",
                "reward": "rewardedvideo",
                "rewarded": "rewardedvideo",
                "rewardedvideo": "rewardedvideo",
                "rewardedVideo": "rewardedvideo",
            },

            adsFlags: {
                hasSystemPaused: false,
                adShowing: null,
                adRequestTimeoutId: {
                    "interstitial": null,
                    "rewardedvideo": null
                },
                adProcessTimeoutId: {
                    "interstitial": null,
                    "rewardedvideo": null
                },
                adCooldownTimeoutId: {
                    "interstitial": null,
                    "rewardedvideo": null
                },
                cachedBgmMutedFlag: null,
                cachedSfxMutedFlag: null,
                cachedSfxVolume: null,
                cachedBgmVolume: null
            },

            init: function(settings) {
                ig.merge(this.settings, settings);
                // alias
                this.setAlias();

                // get URL parameters
                this.getUrlParameters();

                // init Google Ad Placement API
                this.initGoogleAfg();

                // init Google Analytics
                this.initGA();

                // whitelabel
                this.whitelabel();

                // inject CSS
                this.injectCSS();

                // reorient on init
                this.reorientGame();

                this.log("Initialized");

                // expose functions
                return this;
            },

            setAlias: function() {
                ig.strongbits = this;
                ig.global.strongbits = window.strongbits = this;
            },

            getQueryVariable: function(variable) {
                var hashes = window.location.href
                    .slice(window.location.href.indexOf("?") + 1)
                    .split("&");

                for (var i = 0; i < hashes.length; i++) {
                    var match = hashes[i].match(/([^=]+?)=(.+)/);

                    if (match) {
                        var key = decodeURIComponent(match[1]),
                            value = decodeURIComponent(match[2]);

                        if (variable === key) {
                            return value;
                        }
                    }
                }
            },

            getUrlParameters: function() {
                for (var key in this.parameters.properties) {
                    if (this.parameters.properties.hasOwnProperty(key)) {
                        var type = this.parameters.properties[key].type,
                            defaultValue = this.parameters.properties[key].default,
                            currentValue = this.getQueryVariable(key);

                        if (typeof defaultValue !== "undefined" && defaultValue !== null) {
                            this.parameters[key] = defaultValue;
                        }

                        if (typeof currentValue !== "undefined" && currentValue !== null) {
                            switch (type) {
                                case "float":
                                    this.parameters[key] = parseFloat(currentValue);
                                    break;
                                case "integer":
                                    this.parameters[key] = parseInt(currentValue);
                                    break;
                                case "boolean":
                                    this.parameters[key] =
                                        currentValue === "true" ||
                                        currentValue === "on" ||
                                        currentValue === "1" ||
                                        currentValue === "yes";
                                    break;

                                default:
                                case "string":
                                    this.parameters[key] = currentValue;
                                    break;
                            }
                        }

                        this.settings.customUrlParameterName;
                    }
                }
            },

            injectElementTag: function(documentNode, tagName, elementId, elementAttributes, onloadCallback) {
                var newElement,
                    firstElement = documentNode.getElementsByTagName(tagName)[0];

                if (documentNode.getElementById(elementId)) {
                    return;
                }

                newElement = documentNode.createElement(tagName);
                if (typeof elementId === "string" && elementId !== null) {
                    newElement.id = elementId;
                }

                newElement.async = true;
                for (var attributeKey in elementAttributes) {
                    if (elementAttributes.hasOwnProperty(attributeKey)) {
                        newElement.setAttribute(
                            attributeKey,
                            elementAttributes[attributeKey]
                        );
                    }
                }

                newElement.onload = onloadCallback;

                firstElement.parentNode.insertBefore(newElement, firstElement);

                return newElement;
            },

            initGoogleAfg: function() {
                if (this.googleAfg) {
                    if (this.googleAfg.enabled === true) {
                        if (this.googleAfg.loaded) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                if (this.googleAfg) {
                    var data = {
                        "src": this.googleAfg.url + "?client=" + (this.parameters["publisher-id"] || this.googleAfg.publisherId),
                        "type": "text/javascript",
                        "data-ad-channel": (this.parameters["ad-channel"] || this.googleAfg.adChannel),
                        "data-ad-client": (this.parameters["publisher-id"] || this.googleAfg.publisherId),
                        "data-ad-frequency-hint": (Math.max(30, this.adsFlags.cooldownTime) + "s") || "30s",
                        "crossorigin": "anonymous"
                    }
                    if (this.parameters["test"] == "on") {
                        data["data-adbreak-test"] = "on";
                    }
                    this.injectElementTag(document, "script", "", data, function() {
                            try {
                                this.googleAfg.loaded = true;

                                window.adsbygoogle = window.adsbygoogle || [];
                                window.adBreak = window.adConfig = function(o) {
                                    window.adsbygoogle.push(o);
                                }
                                this.googleAfg.instance = window.adBreak;

                                window.adConfig({
                                    preloadAdBreaks: 'on',
                                    onReady: function() {
                                            this.adsFlags.adSlotReady = true;
                                        }
                                        .bind(this)
                                });

                                this.onloadGoogleAfg();
                            } catch (error) {
                                this.googleAfg.loaded = false;
                            }

                            this.log("loaded Google Ad Placement API");
                        }
                        .bind(this));
                }
            },

            initGA: function() {
                if (this.googleAnalytics) {
                    if (this.googleAnalytics.enabled === true) {
                        if (this.googleAnalytics.loaded === true) {
                            return false;
                        }

                        var attributes = {
                            "src": this.googleAnalytics.gtag.url + "?id=" + this.googleAnalytics.gtag.id
                        };

                        this.injectElementTag(document, 'script', 'gtag', attributes, function(event) {
                                window.dataLayer = window.dataLayer || [];

                                function gtag() {
                                    dataLayer.push(arguments);
                                }
                                gtag('js', new Date());

                                gtag('config', this.googleAnalytics.gtag.id);
                            }
                            .bind(this));
                    }
                }
            },

            getAdTypeByName: function(adType) {
                return this.adTypes[adType] || "interstitial";
            },

            getAdLoaded: function(adType) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                return (this.googleAfg.adSlots[adType]);
            },

            getAdRequestStatus: function(adType) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                return (this.adFlags.adRequestTimeoutId[adType] > 0);
            },

            getAdProcessStatus: function(adType) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                return (this.adFlags.adProcessTimeoutId[adType] > 0);
            },

            getAdCooldownStatus: function(adType) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                return (this.adFlags.adCooldownTimeoutId[adType] > 0);
            },

            muteAudio: function() {
                // mute audio - set volume to 0
                if (typeof ig !== "undefined") {
                    if (typeof ig.soundHandler !== "undefined") {
                        if (typeof ig.soundHandler.onSystemPause === "function") {
                            var fromFocusBlur = true;
                            ig.soundHandler.onSystemPause();

                            if (typeof ig.soundHandler.muteAll === "function") {
                                ig.soundHandler.muteAll(fromFocusBlur);
                            }
                        } else {
                            var flagChange = false;
                            if (typeof ig.soundHandler.muteAll === "function") {
                                ig.soundHandler.muteAll(flagChange);
                            } else if (typeof ig.soundHandler.mute === "function") {
                                ig.soundHandler.mute(flagChange);
                            }

                            if (typeof ig.soundHandler.muteBGM === "function") {
                                ig.soundHandler.muteBGM(flagChange);
                            }

                            if (typeof ig.soundHandler.muteSFX === "function") {
                                ig.soundHandler.muteSFX(flagChange);
                            }
                        }

                        if (typeof ig.soundHandler.sfxPlayer !== "undefined") {
                            if (typeof ig.soundHandler.sfxPlayer.volume === "function") {
                                ig.soundHandler.sfxPlayer.volume(0);
                            }
                        }

                        if (typeof ig.soundHandler.bgmPlayer !== "undefined") {
                            if (typeof ig.soundHandler.bgmPlayer.volume === "function") {
                                ig.soundHandler.bgmPlayer.volume(0);
                            }
                        }

                        if (ig.music) {
                            if (typeof ig.music.setVolume === "function") {
                                ig.music.setVolume(0);
                            }
                        }
                    }
                }
            },

            unmuteAudio: function() {
                if (typeof ig !== "undefined") {
                    if (typeof ig.soundHandler !== "undefined") {
                        if (
                            this.adFlags.cachedSfxMutedFlag !== true &&
                            this.adFlags.cachedBgmMutedFlag !== true
                        ) {
                            // unmute all
                            if (typeof ig.soundHandler.onSystemResume === "function") {
                                var fromFocusBlur = true;
                                ig.soundHandler.onSystemResume();

                                if (typeof ig.soundHandler.muteAll === "function") {
                                    ig.soundHandler.unmuteAll(fromFocusBlur);
                                }
                            } else {
                                var flagChange = false;
                                if (typeof ig.soundHandler.unmuteAll === "function") {
                                    ig.soundHandler.unmuteAll(flagChange);
                                } else if (typeof ig.soundHandler.unmute === "function") {
                                    ig.soundHandler.unmute(flagChange);
                                }
                            }
                        } else if (this.adFlags.cachedSfxMutedFlag !== true) {
                            // unmute SFX
                            if (typeof ig.soundHandler.onSystemResume === "function") {
                                var fromFocusBlur = true;
                                if (typeof ig.soundHandler.unmuteSFX === "function") {
                                    ig.soundHandler.unmuteSFX(fromFocusBlur);
                                }

                                if (typeof ig.soundHandler.sfxPlayer !== "undefined") {
                                    if (
                                        typeof ig.soundHandler.sfxPlayer.onSystemResume ===
                                        "function"
                                    ) {
                                        ig.soundHandler.sfxPlayer.onSystemResume();
                                    }
                                }
                            } else {
                                var flagChange = false;
                                if (typeof ig.soundHandler.unmuteSFX === "function") {
                                    ig.soundHandler.unmuteSFX(flagChange);
                                }
                            }
                        } else if (this.adFlags.cachedBgmMutedFlag !== true) {
                            // unmute BGM
                            if (typeof ig.soundHandler.onSystemResume === "function") {
                                var fromFocusBlur = true;
                                ig.soundHandler.onSystemResume();

                                if (typeof ig.soundHandler.unmuteBGM === "function") {
                                    ig.soundHandler.unmuteBGM(fromFocusBlur);
                                }

                                if (typeof ig.soundHandler.bgmPlayer !== "undefined") {
                                    if (
                                        typeof ig.soundHandler.bgmPlayer.onSystemResume ===
                                        "function"
                                    ) {
                                        ig.soundHandler.bgmPlayer.onSystemResume();
                                    }
                                }
                            } else {
                                var flagChange = false;
                                if (typeof ig.soundHandler.unmuteBGM === "function") {
                                    ig.soundHandler.unmuteBGM(flagChange);
                                }
                            }
                        }
                    }
                }

                this.setVolumeFromCache();
            },

            cacheAudio: function() {
                // cache volume
                this.cacheAudioVolume();

                // cache muted flag
                this.cacheAudioMutedFlag();

                this.log("Audio settings has been cached");
            },

            cacheAudioVolume: function() {
                // invalidation before using the variables
                this.adFlags.cachedSfxVolume = null;
                this.adFlags.cachedBgmVolume = null;

                // Store current game volume
                this.cacheSfxVolume();
                this.cacheBgmVolume();
            },

            cacheAudioMutedFlag: function() {
                // invalidation before using the variables
                this.adFlags.cachedSfxMutedFlag = null;
                this.adFlags.cachedBgmMutedFlag = null;

                // Store current game muted flag
                this.cacheSfxMutedFlag();
                this.cacheBgmMutedFlag();
            },

            cacheSfxVolume: function() {
                if (typeof ig !== "undefined") {
                    if (typeof ig.soundHandler !== "undefined") {
                        if (typeof ig.soundHandler.sfxPlayer !== "undefined") {
                            if (typeof ig.soundHandler.sfxPlayer.getVolume === "function") {
                                if (this.adFlags.cachedSfxVolume === null) {
                                    this.adFlags.cachedSfxVolume =
                                        ig.soundHandler.sfxPlayer.getVolume();
                                }
                            }
                        }
                    }
                }
            },

            cacheBgmVolume: function() {
                if (typeof ig !== "undefined") {
                    if (typeof ig.soundHandler !== "undefined") {
                        if (typeof ig.soundHandler.bgmPlayer !== "undefined") {
                            if (typeof ig.soundHandler.bgmPlayer.getVolume === "function") {
                                if (this.adFlags.cachedBgmVolume === null) {
                                    return this.adFlags.cachedBgmVolume =
                                        ig.soundHandler.bgmPlayer.getVolume();
                                }
                            }
                        }
                    }

                    if (ig.music) {
                        if (typeof ig.music.getVolume === "function") {
                            if (this.adFlags.cachedBgmVolume === null) {
                                return this.adFlags.cachedBgmVolume = ig.music.getVolume();
                            }
                        }
                    }
                }
            },

            cacheSfxMutedFlag: function() {
                if (typeof ig !== "undefined") {
                    if (typeof ig.soundHandler !== "undefined") {
                        if (typeof ig.soundHandler.muted !== "undefined") {
                            if (this.adFlags.cachedSfxMutedFlag === null) {
                                this.adFlags.cachedSfxMutedFlag = ig.soundHandler.muted;
                            }
                        }

                        if (typeof ig.soundHandler.sfxPlayer !== "undefined") {
                            if (typeof ig.soundHandler.sfxPlayer.isMuted !== "undefined") {
                                if (this.adFlags.cachedSfxMutedFlag === null) {
                                    this.adFlags.cachedSfxMutedFlag =
                                        ig.soundHandler.sfxPlayer.isMuted;
                                    return this.adFlags.cachedSfxMutedFlag;
                                }
                            }

                            if (
                                typeof ig.soundHandler.sfxPlayer.stayMuteFlag !== "undefined"
                            ) {
                                if (this.adFlags.cachedSfxMutedFlag === null) {
                                    this.adFlags.cachedSfxMutedFlag =
                                        ig.soundHandler.sfxPlayer.stayMuteFlag;
                                    return this.adFlags.cachedSfxMutedFlag;
                                }
                            }

                            if (typeof ig.soundHandler.sfxPlayer.muteFlag !== "undefined") {
                                if (this.adFlags.cachedSfxMutedFlag === null) {
                                    this.adFlags.cachedSfxMutedFlag =
                                        ig.soundHandler.sfxPlayer.muteFlag;
                                    return this.adFlags.cachedSfxMutedFlag;
                                }
                            }
                        }

                        if (typeof Howler !== "undefined") {
                            if (typeof Howler._muted !== "undefined") {
                                if (this.adFlags.cachedSfxMutedFlag === null) {
                                    this.adFlags.cachedSfxMutedFlag = Howler._muted;
                                }
                            }
                        }
                    }
                }
            },

            cacheBgmMutedFlag: function() {
                if (typeof ig !== "undefined") {
                    if (typeof ig.soundHandler !== "undefined") {
                        if (typeof ig.soundHandler.muted !== "undefined") {
                            if (this.adFlags.cachedBgmMutedFlag === null) {
                                this.adFlags.cachedBgmMutedFlag = ig.soundHandler.muted;
                                return this.adFlags.cachedBgmMutedFlag;
                            }
                        }

                        if (typeof ig.soundHandler.bgmPlayer !== "undefined") {
                            if (typeof ig.soundHandler.bgmPlayer.isMuted !== "undefined") {
                                if (this.adFlags.cachedBgmMutedFlag === null) {
                                    this.adFlags.cachedBgmMutedFlag =
                                        ig.soundHandler.bgmPlayer.isMuted;
                                    return this.adFlags.cachedBgmMutedFlag;
                                }
                            }

                            if (
                                typeof ig.soundHandler.bgmPlayer.stayMuteFlag !== "undefined"
                            ) {
                                if (this.adFlags.cachedBgmMutedFlag === null) {
                                    this.adFlags.cachedBgmMutedFlag =
                                        ig.soundHandler.bgmPlayer.stayMuteFlag;
                                    return this.adFlags.cachedBgmMutedFlag;
                                }
                            }

                            if (typeof ig.soundHandler.bgmPlayer.muteFlag !== "undefined") {
                                if (this.adFlags.cachedBgmMutedFlag === null) {
                                    this.adFlags.cachedBgmMutedFlag =
                                        ig.soundHandler.bgmPlayer.muteFlag;
                                    return this.adFlags.cachedBgmMutedFlag;
                                }
                            }
                        }
                    }
                }
            },

            setVolumeFromCache: function() {
                // Restore stored game volume
                this.setSfxVolumeFromCache();
                this.setBgmVolumeFromCache();
            },

            setSfxVolumeFromCache: function() {
                if (this.adFlags.cachedSfxVolume >= 0) {
                    if (typeof ig !== "undefined") {
                        if (typeof ig.soundHandler !== "undefined") {
                            if (typeof ig.soundHandler.sfxPlayer !== "undefined") {
                                if (typeof ig.soundHandler.sfxPlayer.volume === "function") {
                                    ig.soundHandler.sfxPlayer.volume(
                                        this.adFlags.cachedSfxVolume
                                    );
                                }
                            }
                        }
                    }
                }
            },

            setBgmVolumeFromCache: function() {
                if (this.adFlags.cachedBgmVolume >= 0) {
                    if (typeof ig !== "undefined") {
                        if (typeof ig.soundHandler !== "undefined") {
                            if (typeof ig.soundHandler.bgmPlayer !== "undefined") {
                                if (typeof ig.soundHandler.bgmPlayer.volume === "function") {
                                    ig.soundHandler.bgmPlayer.volume(
                                        this.adFlags.cachedBgmVolume
                                    );
                                }
                            }
                        }

                        if (ig.music) {
                            if (typeof ig.music.setVolume === "function") {
                                ig.music.setVolume(this.adFlags.cachedBgmVolume);
                            }
                        }
                    }
                }
            },

            updateAdContainerCSS: function() {
                var adContainerElement = document.getElementById("adContainer");

                if (typeof(adContainerElement) !== "undefined" && adContainerElement !== null) {
                    adContainerElement.style.width = '100vw';
                    adContainerElement.style.height = '100vh';
                    adContainerElement.style.zIndex = 1;

                    var adContainerChildNodes = adContainerElement.childNodes;
                    if (typeof(adContainerChildNodes) !== "undefined" && adContainerChildNodes !== null) {
                        if (adContainerChildNodes.length > 0) {
                            adContainerChildElement = adContainerChildNodes[0];
                            adContainerChildElement.style.width = '100vw';
                            adContainerChildElement.style.height = '100vh';

                            var adContainerChildIframe = adContainerChildElement.querySelector("iFrame");
                            if (typeof(adContainerChildIframe) !== "undefined" && adContainerChildIframe !== null) {
                                adContainerChildIframe.style.width = '100vw';
                                adContainerChildIframe.style.height = '100vh';
                            }
                        }
                    }

                    adContainerElement.focus();
                }
            },

            onloadGoogleAfg: function() {
                if (!this.googleAfg.loaded) {
                    this.log("Google Ad Placement API is not ready");
                    return;
                }

                this.showAd("preroll");
            },

            reportSoundStatus: function(status) {
                if (!this.googleAfg.loaded) {
                    this.log("Google Ad Placement API is not ready");
                    return;
                }

                try {
                    window.adConfig({
                        sound: (status > 0) ? "on" : "off"
                    });
                    this.cacheAudio();
                } catch (error) {
                    this.googleAfg.loaded = false;
                }

                this.log("Sound status reported: " + status);
            },

            showAd: function(adType, successCallback, failureCallback) {
                if (!this.googleAfg.loaded) {
                    this.log("Google Ad Placement API is not ready");

                    if (typeof(failureCallback) === "function") {
                        failureCallback();
                    }
                    return;
                }

                if (!this.adsFlags.adSlotReady) {
                    this.log("Google Ad Slot is not ready");

                    if (typeof(failureCallback) === "function") {
                        failureCallback();
                    }
                    return;
                }

                if (this.getAdProcessStatus(adType)) {
                    this.log("It's already processing an ad", adType);

                    if (typeof(failureCallback) === "function") {
                        failureCallback();
                    }
                    return;
                }

                if (this.getAdCooldownStatus(adType)) {
                    this.log("Ad is cooling down", adType);

                    if (typeof(failureCallback) === "function") {
                        failureCallback();
                    }
                    return;
                }

                if (this.adFlags.adShowing !== null && typeof(this.adFlags.adShowing) !== "undefined") {
                    this.log("Ad is already showing", this.adFlags.adShowing);

                    if (typeof(failureCallback) === "function") {
                        failureCallback();
                    }
                    return;
                }

                // Request advertisement
                this.onAdRequest(failureCallback);
                try {
                    switch (adType) {
                        case "reward":
                            window.adBreak({
                                type: adType,
                                beforeAd: function() {
                                    this.startRewardedAdCooldown();
                                    this.onAdShow();
                                }.bind(this),
                                beforeReward: function(showAdFunction) {
                                    showAdFunction();
                                }.bind(this),
                                adDismissed: function() {

                                }.bind(this),
                                adViewed: function() {

                                }.bind(this),
                                adBreakDone: function(placementInfo) {
                                    if ((placementInfo !== null && typeof(placementInfo) !== "undefined") &&
                                        (placementInfo.breakStatus !== null && typeof(placementInfo.breakStatus) !== "undefined") &&
                                        placementInfo.breakStatus === "viewed") {
                                        if (successCallback !== null && typeof(successCallback) === "function") {
                                            successCallback();
                                        }
                                    } else {
                                        this.onAdError(placementInfo);
                                        if (failureCallback !== null && typeof(failureCallback) === "function") {
                                            failureCallback();
                                        }
                                    }
                                    this.onAdHide();
                                }.bind(this)
                            });
                            break;

                        case "preroll":
                        case "start":
                        case "pause":
                        case "next":
                        case "browse":
                        default:
                            window.adBreak({
                                type: adType,
                                beforeAd: function() {
                                    this.startAdCooldown();
                                    this.onAdShow();
                                }.bind(this),
                                adBreakDone: function(placementInfo) {
                                    if ((placementInfo !== null && typeof(placementInfo) !== "undefined") &&
                                        (placementInfo.breakStatus !== null && typeof(placementInfo.breakStatus) !== "undefined") &&
                                        placementInfo.breakStatus === "viewed") {
                                        if (successCallback !== null && typeof(successCallback) === "function") {
                                            successCallback();
                                        }
                                    } else {
                                        this.onAdError(placementInfo);
                                        if (failureCallback !== null && typeof(failureCallback) === "function") {
                                            failureCallback();
                                        }
                                    }
                                    this.onAdHide();
                                }.bind(this)
                            });
                            break;
                    }
                } catch (error) {
                    this.onAdError(error);
                    if (failureCallback !== null && typeof(failureCallback) === "function") {
                        failureCallback();
                    }
                }
            },

            reorientGame: function() {
                if (typeof ig !== "undefined") {
                    if (typeof ig.sizeHandler !== "undefined") {
                        if (typeof ig.sizeHandler.reorient === "function") {
                            ig.sizeHandler.reorient();
                        }
                    }
                }

                if (typeof orientationHandler === "function") {
                    orientationHandler();
                }
            },

            onSystemResume: function() {
                if (this.adFlags.hasSystemPaused === false) {
                    this.log("System has resumed");
                    return;
                }
                this.adFlags.hasSystemPaused = false;

                this.resumeGame();
                this.unmuteAudio();
                this.hideLoadingSpinner();
            },

            pauseGame: function() {
                // hide game
                // var gameWrapper = document.getElementById("game");
                // gameWrapper.style.visibility = "hidden";

                // pause game
                if (typeof ig !== "undefined") {
                    if (ig.game) {
                        if (typeof ig.game.pauseGame === "function") {
                            ig.game.pauseGame(true);
                        }

                        if (typeof ig.game.pause === "function") {
                            ig.game.pause(true);
                        }
                    }
                }

                if (ig.visibilityHandler) {
                    if (typeof ig.visibilityHandler.onOverlayShow === "function") {
                        ig.visibilityHandler.onOverlayShow(this.NAME);
                    }
                }

                if (typeof this.settings.callback.pauseGame === "function") {
                    this.settings.callback.pauseGame();
                }
            },

            resumeGame: function() {
                if (typeof ig.visibilityHandler !== "undefined") {
                    if (typeof ig.visibilityHandler.onOverlayHide === "function") {
                        ig.visibilityHandler.onOverlayHide(this.NAME);
                    }
                }

                // show game
                var gameWrapper = document.getElementById("game");
                gameWrapper.style.visibility = "visible";

                // resume game
                if (typeof ig !== "undefined") {
                    if (ig.game) {
                        if (typeof ig.game.resumeGame === "function") {
                            ig.game.resumeGame(true);
                        }

                        if (typeof ig.game.resume === "function") {
                            ig.game.resume(true);
                        }
                    }
                }

                // window focus
                if (document.activeElement) {
                    document.activeElement.blur();
                }
                window.focus();

                if (typeof this.settings.callback.resumeGame === "function") {
                    this.settings.callback.resumeGame();
                }
            },

            injectCSS: function() {
                var styles = '';

                styles += '#mjs-loading-overlay{z-index:100;position:fixed;width:100%;height:100%;background-color:#000000;opacity:0.5;}';
                styles += '.lds-spinner{color:official;display:inline-block;position:relative;width:80px;height:80px;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);}';
                styles += '.lds-spinner div{transform-origin:40px 40px;animation:lds-spinner 1.2s linear infinite}';
                styles += '.lds-spinner div:after{content:" ";display:block;position:absolute;top:3px;left:37px;width:6px;height:18px;border-radius:20%;background:#fff}';
                styles += '.lds-spinner div:nth-child(1){transform:rotate(0);animation-delay:-1.1s}';
                styles += '.lds-spinner div:nth-child(2){transform:rotate(30deg);animation-delay:-1s}';
                styles += '.lds-spinner div:nth-child(3){transform:rotate(60deg);animation-delay:-.9s}';
                styles += '.lds-spinner div:nth-child(4){transform:rotate(90deg);animation-delay:-.8s}';
                styles += '.lds-spinner div:nth-child(5){transform:rotate(120deg);animation-delay:-.7s}';
                styles += '.lds-spinner div:nth-child(6){transform:rotate(150deg);animation-delay:-.6s}';
                styles += '.lds-spinner div:nth-child(7){transform:rotate(180deg);animation-delay:-.5s}';
                styles += '.lds-spinner div:nth-child(8){transform:rotate(210deg);animation-delay:-.4s}';
                styles += '.lds-spinner div:nth-child(9){transform:rotate(240deg);animation-delay:-.3s}';
                styles += '.lds-spinner div:nth-child(10){transform:rotate(270deg);animation-delay:-.2s}';
                styles += '.lds-spinner div:nth-child(11){transform:rotate(300deg);animation-delay:-.1s}';
                styles += '.lds-spinner div:nth-child(12){transform:rotate(330deg);animation-delay:0s}';
                styles += '@keyframes lds-spinner{0%{opacity:1}100%{opacity:0}}';

                var styleElement = document.createElement('style');
                styleElement.textContent = styles;

                /** overriding margin */
                document.head.append(styleElement);
                document.body.style.margin = "0px";
            },

            showLoadingSpinner: function() {
                this.hideLoadingSpinner();
                var spinner = document.createElement("div");
                spinner.id = "mjs-loading-overlay";
                spinner.innerHTML =
                    '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
                document.getElementById("ajaxbar").appendChild(spinner);
            },

            hideLoadingSpinner: function() {
                var spinner = document.getElementById("mjs-loading-overlay");
                if (typeof spinner !== "undefined" && spinner !== null) {
                    spinner.remove();
                }
            },

            startAdRequestTimeout: function(adType, callback, time) {
                var adType = this.getAdTypeByName(adType) || "interstitial";
                time = (time || this.settings.adRequestTimeout[adType]) * 1000;

                if (!this.getAdRequestStatus(adType)) {
                    this.adFlags.adRequestTimeoutId[adType] = window.setTimeout(function() {
                        this.stopAdRequestTimeout(adType, callback);
                        if (callback !== null && typeof(callback) === "function") {
                            callback();
                        }
                    }.bind(this, adType, callback), time);
                    this.log("Ad request timeout started", adType);
                } else {
                    this.log("Already requesting ads", adType);
                }
            },

            stopAdRequestTimeout: function(adType) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                if (this.getAdRequestStatus(adType)) {
                    window.clearInterval(this.adFlags.adRequestTimeoutId[adType]);
                    this.adFlags.adRequestTimeoutId[adType] = null;
                    this.log("Ad request timeout stopped", adType);
                }
            },

            startAdProcessTimeout: function(adType, callback, time) {
                var adType = this.getAdTypeByName(adType) || "interstitial";
                time = (time || this.settings.adProcessTimeout[adType]) * 1000;

                if (!this.getAdProcessStatus(adType)) {
                    this.adFlags.adProcessTimeoutId[adType] = window.setTimeout(function() {
                        this.stopAdProcessTimeout(adType, callback);
                        if (callback !== null && typeof(callback) === "function") {
                            callback();
                        }
                    }.bind(this, adType, callback), time);
                    this.log("Ad process timeout started", adType);
                } else {
                    this.log("Already processing ads", adType);
                }
            },

            stopAdProcessTimeout: function(adType) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                if (this.getAdProcessStatus(adType)) {
                    window.clearInterval(this.adFlags.adProcessTimeoutId[adType]);
                    this.adFlags.adProcessTimeoutId[adType] = null;
                    this.log("Ad process timeout stopped", adType);
                }
            },

            startAdCooldown: function(adType, callback, time) {
                var adType = this.getAdTypeByName(adType) || "interstitial";
                time = (time || this.settings.adCooldownTimeout[adType]) * 1000;

                if (!this.getAdCooldownStatus(adType)) {
                    this.adFlags.adCooldownTimeoutId[adType] = window.setTimeout(function() {
                        this.stopAdCooldown(adType);
                        if (callback !== null && typeof(callback) === "function") {
                            callback();
                        }
                    }.bind(this, adType, callback), time);
                    this.log("Started cooling down ads", adType);
                } else {
                    this.log("Already cooling down ads", adType);
                }
            },

            stopAdCooldown: function(adType) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                if (this.getAdCooldownStatus(adType)) {
                    window.clearTimeout(this.adFlags.adCooldownTimeoutId[adType]);
                    this.adFlags.adCooldownTimeoutId[adType] = null;
                    this.log("Stopped cooling down ads", adType);
                }
            },

            onAdRequest: function(adType, callback) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                if (this.getAdRequestStatus(adType)) {
                    this.log("Ad has been requested", adType);
                    return;
                }

                this.log("Requesting ad", adType);

                this.onSystemPause();
                this.startAdRequestTimeout(adType, function() {
                    this.onSystemResume();
                    if (typeof(callback) === "function") {
                        callback();
                    }
                }.bind(this, callback));
            },

            onAdProcess: function(adType, callback) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                if (this.getAdProcessStatus(adType)) {
                    this.log("It's already processing an ad", adType);
                    return;
                }

                this.log("Processing ad", adType);

                this.onSystemPause();
                this.startAdProcessTimeout(adType, function() {
                    this.onSystemResume();
                    if (typeof(callback) === "function") {
                        callback();
                    }
                }.bind(this, callback));
            },

            onAdShown: function(adType) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                this.adFlags.adShowing = adType;
                this.log("Showing ad", adType);

                this.onSystemPause();

                this.stopAdProcessTimeout(adType);
                this.stopAdRequestTimeout(adType);
                this.startAdCooldown(adType);
                this.updateAdContainerCSS();
            },

            onAdHide: function(adType) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                this.googleAfg.adSlots[adType] = null;

                this.adFlags.adShowing = null;
                this.stopAdProcessTimeout(adType);
                this.stopAdRequestTimeout(adType);
                this.onSystemResume();
            },

            onAdError: function(adType, adError) {
                var adType = this.getAdTypeByName(adType) || "interstitial";

                this.log("Ad error", adType, JSON.stringify(adError));

                this.onAdHide(adType);
            },

            whitelabel: function() {
                if (_SETTINGS && typeof(_SETTINGS) !== "undefined") {
                    if (_SETTINGS["Branding"] && typeof(_SETTINGS["Branding"]) !== "undefined") {
                        _SETTINGS["Branding"]["Splash"]["Enabled"] = false;
                        _SETTINGS["Branding"]["Logo"]["Enabled"] = false;
                    }
                    if (_SETTINGS["DeveloperBranding"] && typeof(_SETTINGS["DeveloperBranding"]) !== "undefined") {
                        _SETTINGS["DeveloperBranding"]["Splash"]["Enabled"] = false;
                    }
                    if (_SETTINGS["MoreGames"] && typeof(_SETTINGS["MoreGames"]) !== "undefined") {
                        _SETTINGS["MoreGames"]["Enabled"] = false;
                        _SETTINGS["MoreGames"]["Link"] = "";
                    }
                    if (_SETTINGS["TapToStartAudioUnlock"] && typeof(_SETTINGS["TapToStartAudioUnlock"]) !== "undefined") {
                        _SETTINGS["TapToStartAudioUnlock"]["Enabled"] = false;
                    }
                }

                if (MyGame && typeof(MyGame) !== "undefined") {
                    MyGame.prototype.dctf = function() {};
                }

                if (ig && typeof(ig.Fullscreen) !== "undefined") {
                    ig.Fullscreen.enableFullscreenButton = false;
                }
            },

            log: function(message) {
                var args = Array.prototype.slice.call(arguments, 1);
                var verboseMode = this.parameters.verbose;

                if (typeof(this.parameters.verbose) === "string") {
                    verboseMode = verboseMode.toLowerCase();
                }

                switch (verboseMode) {
                    case "false":
                    case "off":
                    case "no":
                    case "0":
                    case "":
                    case 0:
                    case null:
                    case false:
                    case undefined:
                        break;

                    default:
                    case "true":
                    case "yes":
                    case "on":
                    case "1":
                    case 1:
                    case true:
                        if (window.console && typeof window.console.log === "function") {
                            var logMessage = "%c[" + this.NAME + (" v" + this.VERSION + "] ").toString() + message + " ";
                            for (var i = 0; i < args.length; i++) {
                                logMessage += args[i] + " ";
                            }
                            console.log(logMessage, this.settings.logStyles.log);
                        }
                        break;

                    case "trace":
                    case "2":
                    case 2:
                        if (window.console && typeof window.console.trace === "function") {
                            var traceMessage = "%c[" + this.NAME + (" v" + this.VERSION + "] ").toString() + message + " ";
                            for (var i = 0; i < args.length; i++) {
                                traceMessage += args[i] + " ";
                            }
                            console.trace(traceMessage, this.settings.logStyles.trace);
                        }
                        break;
                }
            }
        });

        // ig.strongbits = new ig.StrongBitsAPI(); // no longer need to initialized as we are injecting ig.ApiHandler
    });