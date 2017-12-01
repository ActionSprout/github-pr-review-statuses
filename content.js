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

function addActionSproutPRFilterButtons() {
  const user = 'ActionSprout';
  const $searchForm = $('.subnav-search.float-left');
  const $searchInput = $searchForm.find('input.subnav-search-input');
  const currentSearch = $searchInput.attr('value');
  const $subNavLeft = $('div.subnav-links');
  const userIsActionSprout = currentSearch.indexOf("user:ActionSprout") > -1;

  // Handle Left Nav - Toggle ActionSprout Button
  const subNavRightHtml = `
    <div class="subnav-links float-right" role="navigation">
      <a href='' aria-label="Toggle user:actionsprout" class="toggle-as js-selected-navigation-item subnav-item" role="tab">Toggle ActionSprout</a>
    </div>
  `;
  const $subNavRight = $(subNavRightHtml);

  $searchForm.parent().addClass('get-on-your-on-line');

  if ($('.subnav-links a.toggle-as').length === 0) {
    $subNavLeft.after($subNavRight);
    $subNavRight.find('a').click(function _toggleAsClick() {
      const newSearch = userIsActionSprout ? currentSearch.replace("user:ActionSprout", '') : (currentSearch + " user:ActionSprout");
      window.location = `https://${window.location.host}/pulls?utf8=✓&q=${newSearch}`;
    });
  }

  if (userIsActionSprout) {
    $subNavRight.find('.toggle-as').addClass('selected');
  }

  // Handle All As Repos Button
  const findAllAsRepoButton = () =>
    $subNavLeft.find('a[aria-label~=ActionSprout]')
  ;

  const asReposButton = findAllAsRepoButton();
  const actionSproutSearch = `is:open is:pr user:${user} sort:updated-desc`;

  if (asReposButton.length === 0) {
      const newButton = `<a href="/pulls?utf8=✓&q=${actionSproutSearch}" style="border-left: 0ps;" aria-label="ActionSprout open pull requests" class="js-selected-navigation-item subnav-item" role="tab">All AS Repos</a>`;
      $subNavLeft.append(newButton);
  }

  // Highlight the All AS Repos button if the user is ActionSprout and there are no other default filters.
  const hasAuthor = currentSearch.indexOf('author') > -1;
  const hasAssignee = currentSearch.indexOf('assignee') > -1;
  const hasReviewRequest = currentSearch.indexOf('review-requested') > -1;
  const hasMentions = currentSearch.indexOf('mentions') > -1;
  const onAllRepos = userIsActionSprout && !hasAuthor && !hasAssignee && !hasReviewRequest && !hasMentions;
  if (onAllRepos) { findAllAsRepoButton().addClass('selected'); }

}

function runFunctions() {
  applyStylesToPullRequestLabels();
  if (window.location.pathname.indexOf('/pulls') > -1) {
    addActionSproutPRFilterButtons();
  }
}

runFunctions();
const intervalId = setInterval(runFunctions, 1000);
