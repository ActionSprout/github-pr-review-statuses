/* This chrome extension affects the github "Pull requests" route
  - applies styles to the labels on each PR
  - adds a button to all AS PRs (e.g. instead of just those you created)
  - adds a button to toggle the filter 'user:ActionSprout'
  - moves the search bar to a line of it's own
*/

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
  const user = 'user:ActionSprout';
  const jsNavItemClass = 'js-selected-navigation-item subnav-item';

  const $subNavLeft = $('div.subnav-links');

  const $searchForm = $('.subnav-search.float-left');
  const $searchInput = $searchForm.find('input.subnav-search-input');
  const currentSearch = $searchInput.attr('value');

  const userIsActionSprout = currentSearch.indexOf(user) > -1;
  const actionSproutSearch = `is:open is:pr ${user} sort:updated-desc`;

  // Add button for toggling user:ActionSprout filter
  const subNavRightHtml = `
    <div class="subnav-links float-right" role="navigation">
      <a href='' aria-label="Toggle ${user}" class="toggle-as ${jsNavItemClass}" role="tab">Toggle ${user}</a>
    </div>
  `;
  const $subNavRight = $(subNavRightHtml);

  // Move search bar to its own line and lengthen
  $searchForm.parent().addClass('get-on-your-on-line');

  // Implement the toggling of user:ActionSprout
  if ($('.subnav-links a.toggle-as').length === 0) {
    $subNavLeft.after($subNavRight);
    $subNavRight.find('a').click(function _toggleAsClick() {
      const newSearch = userIsActionSprout ? currentSearch.replace(user, '') : (currentSearch + " " + user);
      window.location = `https://${window.location.host}/pulls?utf8=✓&q=${newSearch}`;
    });
  }

  // Highlight the toggle AS button if user:ActionSprout present in filter
  if (userIsActionSprout) {
    $subNavRight.find('.toggle-as').addClass('selected');
  }

  // Find All AS Repos button
  const allASReposButton = () =>
    $subNavLeft.find('a[aria-label~=ActionSprout]')
  ;

  // If All AS Repos button isn't there, add it
  if (allASReposButton().length === 0) {
      const newButton = `<a href="/pulls?utf8=✓&q=${actionSproutSearch}" style="border-left: 0ps;" aria-label="ActionSprout open pull requests" class="${jsNavItemClass}" role="tab">All AS Repos</a>`;
      $subNavLeft.append(newButton);
  }

  // Highlight All AS Repos button if user:ActionSprout and no other default filters
  const hasAuthor = currentSearch.indexOf('author') > -1;
  const hasAssignee = currentSearch.indexOf('assignee') > -1;
  const hasReviewRequest = currentSearch.indexOf('review-requested') > -1;
  const hasMentions = currentSearch.indexOf('mentions') > -1;
  const onAllRepos = userIsActionSprout && !hasAuthor && !hasAssignee && !hasReviewRequest && !hasMentions;
  if (onAllRepos) { allASReposButton().addClass('selected'); }
}

function runFunctions() {
  applyStylesToPullRequestLabels();
  if (window.location.pathname.indexOf('/pulls') > -1) {
    addActionSproutPRFilterButtons();
  }
}

runFunctions();
const intervalId = setInterval(runFunctions, 1000);
