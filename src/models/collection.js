/* global CDN_URL EDITOR_URL*/

export const FALLBACK_AVATAR_URL = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123";

export const colors = {red: "#EF6F6C", orange: "#FFCC6D", yellow: "#F3FF8A", green:"#7DE2D1", cyan: "#45C1F7", purple: "#B19AFF" };

export const defaultAvatar = "https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1540389405633";

export const avatars = {
  computer: "https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcomputer.svg",
  tetris: "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Ftetris.svg",
  robot: "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Frobot.svg",
  hardware: "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fhardware.svg",
  art: "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fart.svg?1499357014248",
  music: "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fmusic.svg?1502555440002",
};


export const getContrastTextColor = (hexcolor) =>{
  // remove #
  console.log(`hexcolor: ${hexcolor}`);
  hexcolor = hexcolor.substring(hexcolor.indexOf("#") +1);

  var r = parseInt(hexcolor.substr(0,2),16);
  var g = parseInt(hexcolor.substr(2,2),16);
  var b = parseInt(hexcolor.substr(4,2),16);
  var yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? 'black' : 'white';
};


export const hexToRgbA = (hex) => {
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.35)';
  }
  return false;
  // throw new Error('Bad Hex');
};

export default function Collection({users, projects}) {
  const props = {
    // get teams() { return teams ? teams.map(team => Team(team).asProps()) : []; },
    get users() { return users ? users.map(user => User(user).asProps()) : []; },
    get projects() {return projects ? projects.map(project => Project(project).asProps()) : []; }
  };
  return {
    update: data => Collection(data),
    asProps: () => props,
  };
}

export function getAvatarUrl(id) {
  return `${CDN_URL}/collection-avatar/${id}.png`;
}

export function getLink(userName, url) {
  return `/@${userName}/${url}`;
}

// Circular dependencies must go below module.exports
// import Team from './team';
import User from './user';
// eventually want to handle whether the collection belongs to a team or a user

import Project from './project';

export const defaultAvatarSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="159px" height="147px" viewBox="0 0 159 147" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: Sketch 52.2 (67145) - http://www.bohemiancoding.com/sketch --><title>collection-avatar</title><defs><polygon id="path-1" points="0 0 159 0 159 132 0 132"></polygon><polygon id="path-3" points="0 0 124 0 124 102 0 102"></polygon></defs><g id="collection-avatar" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><polygon id="frame" fill="#FFFB98" points="0 147 159 147 159 15 0 15"></polygon><polygon class="background" fill="#45C1F7" points="17 132 141 132 141 30 17 30"></polygon><g id="picture-frame-copy"><g id="Group-4" transform="translate(0.000000, 15.000000)"><mask id="mask-2" fill="white"><use xlink:href="#path-1"></use></mask><g id="Clip-3"></g><path d="M4.41666667,127.550562 L154.583333,127.550562 L154.583333,4.4494382 L4.41666667,4.4494382 L4.41666667,127.550562 Z M159,136.449438 L-3.55271368e-15,136.449438 C-2.43947222,136.449438 -4.41666667,134.457573 -4.41666667,132 L-4.41666667,4.4408921e-15 C-4.41666667,-2.45757303 -2.43947222,-4.4494382 -3.55271368e-15,-4.4494382 L159,-4.4494382 C161.439472,-4.4494382 163.416667,-2.45757303 163.416667,4.4408921e-15 L163.416667,132 C163.416667,134.457573 161.439472,136.449438 159,136.449438 Z" id="Fill-2" fill="#222222" mask="url(#mask-2)"></path></g><g id="Group-9" transform="translate(63.000000, 0.000000)" fill="#222222"><path d="M5.39511061,14.06 L29.8773227,14.06 C28.7177318,8.99988 23.6693227,5.18 17.6362167,5.18 C11.6031106,5.18 6.55617121,8.99988 5.39511061,14.06 M32.3331864,18.5 L2.93924697,18.5 C1.72086818,18.5 0.734701515,17.50692 0.734701515,16.28 C0.734701515,7.7108 8.31686818,0.74 17.6362167,0.74 C26.9555652,0.74 34.5377318,7.7108 34.5377318,16.28 C34.5377318,17.50692 33.5515652,18.5 32.3331864,18.5" id="Fill-5"></path><polygon id="Fill-7" points="92.9008682 146.683984 73.3215652 130.551984 76.1139894 127.115424 95.6932924 143.247424"></polygon></g><g id="Group-13" transform="translate(17.000000, 30.000000)"><mask id="mask-4" fill="white"><use xlink:href="#path-3"></use></mask><g id="Clip-12"></g><path d="M4.42857143,97.5652174 L119.571429,97.5652174 L119.571429,4.43478261 L4.42857143,4.43478261 L4.42857143,97.5652174 Z M124,106.434783 L-8.8817842e-14,106.434783 C-2.44604762,106.434783 -4.42857143,104.449478 -4.42857143,102 L-4.42857143,-2.48689958e-14 C-4.42857143,-2.44947826 -2.44604762,-4.43478261 -8.8817842e-14,-4.43478261 L124,-4.43478261 C126.446048,-4.43478261 128.428571,-2.44947826 128.428571,-2.48689958e-14 L128.428571,102 C128.428571,104.449478 126.446048,106.434783 124,106.434783 Z" id="Combined-Shape" fill="#222222" mask="url(#mask-4)"></path><path d="" id="Path-2" stroke="#979797" fill-rule="nonzero" mask="url(#mask-4)"></path></g><g id="corners" transform="translate(0.000000, 16.000000)" fill="#222222"><polygon id="Fill-14" points="140.496387 18 138 14.8389049 155.503613 0 158 3.16109514"></polygon><polygon id="Fill-15" points="17.5036132 18 0 3.16109514 2.49638681 0 20 14.8389049"></polygon><polygon id="Fill-16" points="2.74602549 131 0 127.487672 19.2539745 111 22 114.512328"></polygon></g><path d="M19.4882812,94.8593842 C44.7643229,101.507816 67.0872396,101.059896 86.4570312,93.515625 C115.511719,82.1992188 108.802734,83.5839844 116.876953,81.3066406 C124.951172,79.0292969 136.530273,77.3828125 138.008789,78.2841797 C138.068685,83.0810547 138.235352,100.222656 138.508789,129.708984 C70.5751953,130.298828 31.0029297,130.347656 19.7919922,129.855469 C19.9182943,114.765309 19.8170573,103.099947 19.4882812,94.8593842 Z" id="Path-3" stroke="#222222" stroke-width="4" fill="#05D458" fill-rule="nonzero"></path></g><circle id="Oval" stroke="#000000" stroke-width="4" fill="#E8DE1B" fill-rule="nonzero" cx="40.8486328" cy="59.6357422" r="16"></circle><path d="M60.3348254,77.5704551 C58.9993547,80.6825277 55.8689424,82.8666205 52.2201169,82.8666205 C51.0942738,82.8666205 50.017785,82.6586888 49.0281483,82.2797234 C47.8967722,83.2670781 46.4079181,83.8666205 44.7767575,83.8666205 C41.2366977,83.8666205 38.3669121,81.042731 38.3669121,77.5592868 C38.3669121,74.362029 40.7845266,71.7204047 43.9190364,71.3079336 C44.4206293,69.9153121 45.2738944,68.6864115 46.3737706,67.7246127 C46.0662734,66.8112197 45.8994141,65.8316421 45.8994141,64.8125 C45.8994141,59.8419373 49.8685147,55.8125 54.7646484,55.8125 C58.4425588,55.8125 61.5973616,58.0862365 62.9395833,61.3246338 C63.8172067,61.0552858 64.7505289,60.9101562 65.7182989,60.9101562 C70.8661431,60.9101562 75.0392954,65.0165679 75.0392954,70.0820833 C75.0392954,75.1475988 70.8661431,79.2540104 65.7182989,79.2540104 C63.7128485,79.2540104 61.8553227,78.6307987 60.3348254,77.5704551 Z" id="Combined-Shape" stroke="#000000" stroke-width="4" fill="#FFFFFF" fill-rule="nonzero"></path><path d="M121.554267,48.9330178 C121.561107,48.9330067 121.567948,48.9330011 121.57479,48.9330011 C128.315872,48.9330011 133.780598,54.3103309 133.780598,60.9436034 C133.780598,67.5768759 128.315872,72.9542057 121.57479,72.9542057 C118.736067,72.9542057 116.123683,72.0006337 114.050407,70.4012578 C112.497386,71.7531025 110.455645,72.5736517 108.21914,72.5736517 C103.3565,72.5736517 99.4145508,68.6947458 99.4145508,63.9098727 C99.4145508,62.7888762 99.6309116,61.7176053 100.024784,60.7342885 C98.6643533,59.5776974 97.8034355,57.8676186 97.8034355,55.9596774 C97.8034355,52.4762332 100.673221,49.6523438 104.213281,49.6523438 C104.670308,49.6523438 105.116163,49.69941 105.546114,49.7888854 C106.871499,46.5129316 110.045383,44.2060547 113.75,44.2060547 C117.122846,44.2060547 120.055763,46.1182434 121.554267,48.9330178 Z" id="Combined-Shape-Copy" stroke="#000000" stroke-width="4" fill="#FFFFFF" fill-rule="nonzero"></path><path d="M82.3606089,42.5137208 C86.0065614,42.5895456 88.9384448,45.5215419 88.9384448,49.1273647 C88.9384448,52.7808104 85.928606,55.7425133 82.2157816,55.7425133 C79.6428183,55.7425133 77.4074568,54.3201849 76.2774254,52.2309783 C75.8404163,52.3576604 75.3778461,52.425639 74.8991407,52.425639 C72.2100723,52.425639 70.0301517,50.2805815 70.0301517,47.634519 C70.0301517,44.9884565 72.2100723,42.843399 74.8991407,42.843399 C75.2392876,42.843399 75.5712879,42.8777207 75.8917602,42.9430366 C76.3155392,41.4927371 77.63826,40.4348278 79.2043688,40.4348278 C80.6113173,40.4348278 81.8218341,41.2886374 82.3606089,42.5137208 Z" id="Combined-Shape-Copy-2" stroke="#000000" stroke-width="4" fill="#FFFFFF" fill-rule="nonzero" transform="translate(79.484298, 48.088671) rotate(-27.000000) translate(-79.484298, -48.088671) "></path></g>
</svg>`;