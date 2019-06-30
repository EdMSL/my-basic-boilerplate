import { test } from './components/test/test';

require('$styles/main.css');

const root = document.querySelector('#root');

root.innerHTML = `
<div class="block">
  <h1>Hello world</h1>
  ${test}
</div>
`;
