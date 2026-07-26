import developerIcon from '../../icons/developer.png';
import gitIcon from '../../icons/git.webp';
import eslintIcon from '../../icons/eslint.png';
import prettierIcon from '../../icons/prettier.png';
import jestIcon from '../../icons/jest.webp';
import githubDarkLogo from '../../icons/githubLogoDarkTheme.png';
import githubLightLogo from '../../icons/githubLogoLightTheme.png';
import githubActionsIcon from '../../icons/githubactions.png';
import dockerIcon from '../../icons/docker.png';
import prometheusIcon from '../../icons/Prometheus.webp';
import grafanaIcon from '../../icons/grafana.png';
import datadogIcon from '../../icons/datadog.png';

export const nodeIconMap = {
  'developer': [developerIcon],
  'writing-the-code': [gitIcon],
  'local-testing': [eslintIcon, prettierIcon, jestIcon],
  'commit-push-code': [gitIcon],
  'github': [githubLightLogo],
  'ci-system': [githubActionsIcon],
  'cd-system': [githubActionsIcon],
  'package-container-image': [dockerIcon],
  'push-image-docker-hub': [dockerIcon],
  'monitoring-observability': [prometheusIcon, grafanaIcon, datadogIcon],
};

export function getNodeIcons(nodeId, theme = 'dark') {
  if (nodeId === 'github') {
    // Dark mode (dark card background) -> githubDarkLogo (white octocat logo)
    // Light mode (light card background) -> githubLightLogo (black octocat logo)
    return [theme === 'dark' ? githubDarkLogo : githubLightLogo];
  }
  return nodeIconMap[nodeId] || null;
}

export { githubDarkLogo, githubLightLogo };
