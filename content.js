// Going to find all the Review Status for PR's on the page.

const specific_styles = {
  needs_review_styles: {
    'background': '#1d76db',
  },
  changes_requested_styles: {
    'background': '#d93f0b',
  },
  approved_styles: {
    'background': '#0e8a16',
  },
};


function applyStylesToPullRequestLabels() {
  const base_selector = 'a.tooltipped.tooltipped-s';
  const link_sets = {
    needs_review: $(`${base_selector}[aria-label="Review required before merging"]`),
    changes_requested: $(`${base_selector}[aria-label*="requesting changes"]`),
    approved: $(`${base_selector}[aria-label*="review approval"]`),
  };

  Object.keys(link_sets).map((links) => {
    link_sets[links]
    .css(specific_styles[`${links}_styles`])
    .addClass('label')
    .attr('target', '_blank')
    .attr('rel', 'noopener');
  });
}

function addASReposToPullRequestButtons() {
  const $subNav = $('div.subnav-links');
  const findButton = () =>
    $subNav.find('a[aria-label~=ActionSprout]')
  ;
  const asReposButton = findButton();
  const user = 'ActionSprout';
  const actionSproutSearch = `?q=is%3Aopen+is%3Apr+user%3A${user}+sort%3Aupdated-desc`;

  if (asReposButton.length === 0) {
      const newButton = `<a href="/pulls${actionSproutSearch}" aria-label="ActionSprout open pull requests" class="js-selected-navigation-item subnav-item" role="tab">AS Repos</a>`;
      $subNav.append(newButton);
  }

  // This way we select our button so long as the ActionSprout organization is the selected user.
  const userMatches = window.location.search.match(`user%3A${user}`)
  const shouldSelect = userMatches ? userMatches.length > 0 : false;
  if (shouldSelect) { findButton().addClass('selected'); }

  $('.subnav-search-input-wide').css('width','450px');
  $('.subnav-item:last-child').css('border-left','0px');
}

function runFunctions() {
  applyStylesToPullRequestLabels();
  addASReposToPullRequestButtons();
}

runFunctions();
const intervalId = setInterval(runFunctions, 1000);
