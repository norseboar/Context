(function() {
  // Track if the tutorial has already been run when this browser opened
  // (by default, tutorial should run once every time the browser is opened,
  // unless the user disables it or runs through it)
  var hasTutorialRun = false;

  // Show hoverpane for the selected text or text of the hyperlink
  var clickHandler = function(info, tab) {
    if (info.menuItemId !== 'showContext'){
      return;
    }
    // Send a message to content script, which will surface actual hoverpane
    chrome.tabs.sendMessage(tab.id, {action: 'showPane'});
  }

  // Register a context menu
  chrome.contextMenus.create({
    id: 'showContext',
    title: 'Show more info',
    contexts: ['selection', 'link']
  });

  chrome.contextMenus.onClicked.addListener(clickHandler);

  // Send message to all tabs, killing tutorial if present
  var closeTutorialInAllTabs = function() {
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(function(tab) {
        chrome.tabs.sendMessage(tab.id, {action: 'killTutorial'});
      });
    });
  };

  // listen for messages from extension to inform it about settings
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(sender.id !== chrome.runtime.id) {
        return;
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
        // If the tutorial has already run this session, no need to check the
        // settings
        if(hasTutorialRun) {
          sendResponse({shouldRunTutorial: false});
          return true;
        }
        else {
          chrome.storage.sync.get({
            shouldRunTutorial: true
          }, function(results) {
            sendResponse({shouldRunTutorial: results.shouldRunTutorial});
          });
          return true;
        }
      }

      // User has closed the tutorial, but did not permanently disable it
      if(request.action === 'tempDisableTutorial') {
        hasTutorialRun = true;
        closeTutorialInAllTabs();
      };

      // Tutorial should be disabled (either it was completed, or user asked to
      // not see it)
      if(request.action === 'permanentDisableTutorial') {
        hasTutorialRun = true;
        closeTutorialInAllTabs();
        chrome.storage.sync.set({shouldRunTutorial: false});
      }

      // User wants to blacklist a site from popups showing whenever text is
      // selected
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
    }
  );
})();
