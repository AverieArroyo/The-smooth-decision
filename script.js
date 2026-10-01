const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const frequency = document.querySelector('#frequency');
const frequencyOutput = document.querySelector('#frequency-output');
const costGrid = document.querySelector('#wax-costs');
function renderWaxCosts() {
  const weeks = Number(frequency.value);
  frequencyOutput.value = `Every ${weeks} weeks`;
  const years = [1, 3, 5, 10];
  costGrid.innerHTML = years.map(year => {
    const amount = Math.round((52 / weeks) * 190 * year);
    return `<div><small>${year} ${year === 1 ? 'year' : 'years'}</small><b>${money.format(amount)}</b></div>`;
  }).join('');
}
frequency.addEventListener('input', renderWaxCosts);
renderWaxCosts();

const chart = document.querySelector('#cost-chart');
const chartButtons = document.querySelectorAll('.chart-controls button');
const waxing = [1647, 4940, 8233, 16467];
const years = [1, 3, 5, 10];
function renderChart(laserPrice, label) {
  const max = Math.max(...waxing, laserPrice) * 1.12;
  chart.innerHTML = waxing.map((waxPrice, i) => `
    <div class="chart-group">
      <div class="bar wax" style="height:${waxPrice / max * 100}%"><span>${money.format(waxPrice)}</span></div>
      <div class="bar laser" style="height:${laserPrice / max * 100}%"><span>${money.format(laserPrice)}</span></div>
      <small>${years[i]} yr</small>
    </div>`).join('');
  chart.setAttribute('aria-label', `Cumulative waxing costs compared with ${label} at ${money.format(laserPrice)}`);
  document.querySelector('#laser-legend').textContent = label;
}
chartButtons.forEach(button => button.addEventListener('click', () => {
  chartButtons.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  renderChart(Number(button.dataset.price), button.dataset.label);
}));
renderChart(2382.42, 'LaserAway');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
