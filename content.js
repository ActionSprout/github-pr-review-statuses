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

const base_selector = 'a.tooltipped.tooltipped-s'

function applyLabelStyles() {
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

function addASReposPRsButton() {
  let navLinks = $('.subnav-links')[0];

  if (navLinks.childElementCount < 5 ) {
    const asPrLink = '<a href="/pulls?utf8=%E2%9C%93&q=is%3Apr+user%3AActionSprout+sort%3Aupdated-desc+is%3Aopen+" aria-label="ActionSprout open pull requests" class="js-selected-navigation-item subnav-item" role="tab">AS Repos</a>';

    navLinks.append($(asPrLink)[0]);

    $('.subnav-search-input-wide').css('width','450px');
  }
}

applyLabelStyles();
addASReposPRsButton();

function intervalTick() {
  applyLabelStyles();
  addASReposPRsButton();
}

const intervalId = setInterval(intervalTick, 1000);
