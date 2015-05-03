(function() {
  // Track if the tutorial has already been run when this browser opened
  // (by default, tutorial should run once every time the browser is opened,
  // unless the user disables it or runs through it)
  chrome.runtime.onStartup.addListener(function() {
    console.log('set hasTutorialRun');
    chrome.storage.local.set({hasTutorialRun: false});
  });

  // Register a context menu
  chrome.contextMenus.create({
    id: 'showContext',
    title: 'Tell me more...',
    contexts: ['selection', 'link']
  });

  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId !== 'showContext'){
      return;
    }
    // Send a message to content script, which will surface actual hoverpane
    chrome.tabs.sendMessage(tab.id, {action: 'showPane'});
  });

  // Send message to all tabs, killing tutorial if present
  var closeTutorialInAllTabsExcept = function(exceptions) {
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(function(tab) {
        for(var i = 0; i < exceptions.length; i++) {
          if(exceptions[i] === tab.id) {
            return;
          }
        }
        chrome.tabs.sendMessage(tab.id, {action: 'killTutorial'});
      });
    });
  };

  // listen for messages from extension to inform it about settings
  // TODO: reimplement this with switch statement
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      if(sender.id !== chrome.runtime.id) {
        return;
      }

      // content scripts cannot access what tab they are running in
      // they must send request to background to check
      if(request.query === 'current-tab') {
        sendResponse({tabId: sender.tab.id});
        return true;
      }

      // get whether or not hovercards should be automatically shown whenever
      // text is selected
      if(request.query === 'autoshow') {
        chrome.storage.sync.get({
          autoshow: true
        }, function(results){
          sendResponse({autoshow: results.autoshow});
        });
        return true;
      }

      // get the current blacklist
      if(request.query === 'blacklist') {
        chrome.storage.local.get({
          blacklist: []
        }, function(results) {
          sendResponse({blacklist: results.blacklist});
        });
        return true;
      }

      // get whether the tutorial should be run
      if(request.query === 'shouldRunTutorial') {
        chrome.storage.local.get({hasTutorialRun: false}, function(results) {
          if(results.hasTutorialRun) {
            sendResponse({shouldRunTutorial: false});
          }
          else {
            chrome.storage.sync.get({
              shouldRunTutorial: true
            }, function(results) {
              sendResponse({shouldRunTutorial: results.shouldRunTutorial});
            });
          }
        });
        return true;
      }

      // Add a url to blacklist
      if(request.action === 'addToBlacklist') {
        if(!request.url) {
          return false;
        }
        chrome.storage.local.get({
          blacklist: []
        }, function(results) {
          var blacklist = results.blacklist;
          // Check that the entry doesn't already exist (if it does, return
          // without doing anything)
          // This isn't terribly efficient, but the blacklist should be small
          // enough that it doesn't matter.
          // TODO: add a sort & search if this turns out to be an issue
          for(var i = 0; i < blacklist.length; i++) {
            if(blacklist[i] === request.url) {
              return false;
            }
          }
          blacklist.push(request.url);
          chrome.storage.local.set({blacklist: blacklist});
        });
      }
      // ACTIONS FROM BRANDING PANES
      // ===========================================
      // All branding at the bottom of hoverpanes are shown in iframes to
      // insulate them from host CSS. This means they must communicate with
      // the host page through messages
      if(request.action === 'blacklist-triggered') {
        // Tell main page that the user has blacklisted a page
        chrome.tabs.sendMessage(sender.tab.id,
            {action: 'blacklist-triggered'});
        // Send a notification to the user explaining how to blacklist all
        // pages (this is done in options menu, and not all users know about
        // it)

        var notification = chrome.notifications.create({
          type: 'basic',
          iconUrl: 'logo/logo-hover_green-on-white_48.png',
          title: 'Hovercards disabled for this domain',
          message: 'You can configure when hovercards are shown in the' +
              ' options page. Click here to go.'
        }, function(notificationId) {
          chrome.notifications.onClicked.addListener(function(clickedId) {
            if(clickedId === notificationId){
              chrome.tabs.create({url: 'options.html'});
            }
          });
        });

      }

      if(request.action === 'blacklist-demo') {
        chrome.tabs.sendMessage(sender.tab.id,
            {action: 'blacklist-demo'});
      }

      // ACTIONS FROM TUTORIAL IFRAME =================================================
      // All tutorial pages are shown in iframes to insulate them from host CSS
      // However, this means they do not have direct control over the hoverpane that
      // contains them (nor can they communicate directly with that page)
      if(request.action === 'tutorial-intro-never') {
        chrome.storage.local.set({hasTutorialRun: true})
        closeTutorialInAllTabsExcept([]);
        chrome.storage.sync.set({shouldRunTutorial: false});
        chrome.tabs.sendMessage(sender.tab.id, {action: 'tutorial-close'});
      }
      if(request.action === 'tutorial-intro-not-now') {
        chrome.storage.local.set({hasTutorialRun: true})
        closeTutorialInAllTabsExcept([]);
        chrome.tabs.sendMessage(sender.tab.id, {action: 'tutorial-close'});
      }
      if(request.action === 'tutorial-start') {
        chrome.storage.local.set({hasTutorialRun: true})
        closeTutorialInAllTabsExcept([sender.tab.id]);
        chrome.tabs.sendMessage(sender.tab.id, {action: 'tutorial-start'});
      }
      if(request.action === 'tutorial-step1') {

        chrome.tabs.sendMessage(sender.tab.id, {action: 'tutorial-step1'});
      }
      if(request.action === 'tutorial-step2') {
        chrome.tabs.sendMessage(sender.tab.id, {action: 'tutorial-step2'});
      }
      if(request.action === 'tutorial-step3') {
        chrome.tabs.sendMessage(sender.tab.id, {action: 'tutorial-step3'});
      }
      if(request.action === 'tutorial-exit') {
        chrome.tabs.sendMessage(sender.tab.id, {action: 'tutorial-close'});
      }

      if(request.action === 'tutorial-end') {
        chrome.storage.sync.set({shouldRunTutorial: false});
        chrome.tabs.sendMessage(sender.tab.id, {action: 'tutorial-end'});
      }
      if(request.action === 'tutorial-create-hoverpane') {
        chrome.tabs.sendMessage(sender.tab.id,
            {action: 'tutorial-create-hoverpane', query: request.query,
                autoshow: request.autoshow });
      }
      if(request.action === 'tutorial-close-demo') {
        chrome.tabs.sendMessage(sender.tab.id,
            {action: 'tutorial-close-demo'});
      }
    }
  );
})();
