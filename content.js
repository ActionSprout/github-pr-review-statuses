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
  const user = 'ActionSprout';
  const $subNavLeft = $('div.subnav-links');

  const subNavLeftHtml = `
    <div class="subnav-links float-right" role="navigation">
      <a aria-label="Toggle user:actionsprout" class="toggle-as js-selected-navigation-item subnav-item" role="tab">Toggle ActionSprout</a>
    </div>
  `;
  const $subNavRight = $(subNavLeftHtml);

  const $searchForm = $('.subnav-search.float-left');
  const $searchInput = $searchForm.find('input.subnav-search-input');
  $searchForm.parent().addClass('get-on-your-on-line');

  if ($('.subnav-links a.toggle-as').length === 0) {
    $subNavLeft.after($subNavRight);
    $subNavRight.find('a').click(function _toggleAsClick() {
      console.log('Toggled!');
      const currentSearch = $searchInput.attr('value');
      console.log('current search', currentSearch);
      const hasFilter = currentSearch.indexOf("user:ActionSprout") > -1;

      let search = null;
      if (hasFilter) {
        // Remove Filter
        console.log('Remove the filter!');
        search = currentSearch.replace("user:ActionSprout", '');
      } else {
        // Add Filter
        console.log('Add the filter!');
        search = currentSearch + " user:ActionSprout";
      }
      // Submit Form "Manually"
      window.location = `https://${window.location.host}/pulls?utf8=✓&q=${search}`;
    });
  }

  const findButton = () =>
    $subNavLeft.find('a[aria-label~=ActionSprout]')
  ;

  const asReposButton = findButton();
  const actionSproutSearch = `?q=is%3Aopen+is%3Apr+user%3A${user}+sort%3Aupdated-desc`;

  if (asReposButton.length === 0) {
      const newButton = `<a href="/pulls${actionSproutSearch}" style="border-left: 0ps;" aria-label="ActionSprout open pull requests" class="js-selected-navigation-item subnav-item" role="tab">All AS Repos</a>`;
      $subNavLeft.append(newButton);
  }

  // This way we select our button so long as the ActionSprout organization is the selected user.

  // if (shouldSelect) { findButton().addClass('selected'); }

}

function runFunctions() {
  applyStylesToPullRequestLabels();
  addASReposToPullRequestButtons();
}

runFunctions();
const intervalId = setInterval(runFunctions, 1000);
