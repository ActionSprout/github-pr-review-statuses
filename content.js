// Going to find all the Review Status for PR's on the page.
const general_styles = {
  'display': 'inline-block',
  'padding': '6px 8px',
  'margin-top': '5px',
  'border-radius': '3px',
  'font-size': '1.1em',
  'text-decoration': 'none',
  'line-height': '1.1',
};

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
const link_sets = {
  needs_review: $(`${base_selector}[aria-label="Review required before merging"]`),
  changes_requested: $(`${base_selector}[aria-label*="requesting changes"]`),
  approved: $(`${base_selector}[aria-label*="review approval"]`),
};

Object.keys(link_sets).map((links) => {
  link_sets[links]
    .css(general_styles)
    .css(specific_styles[`${links}_styles`])
    .attr('target', '_blank');
});
