const {items, sections} = require('./items');
const fs = require('fs');

let css = `
.mc-icon {
  image-rendering: crisp-edges;
  image-rendering: pixelated;
  display:inline-block;
  height:calc(32px / var(--n));
  width:calc(32px / var(--n));
  background-position:calc(var(--column)/var(--n) * 32px) calc(var(--row)/var(--n) * 32px);
  background-size:calc(1024px / var(--n)) calc(3648px / var(--n));
}


.icon-size-12 {
  --n:2 !important;
}

.icon-size-24 {
  --n:0.87.5 !important;
}

.icon-size-48 {
  --n:0.75 !important;
}

.icon-size-64 {
  --n:0.5 !important;
}

.icon-size-128 {
  --n:0.25 !important;
}

.icon-size-256 {
  --n:0.125 !important;
}

.icon-size-512 {
  --n:0.0625 !important;
}

.enchanted {
  animation: enchant 10s infinite;
}

@keyframes enchant {
  0% {
    filter: saturate(5) hue-rotate(0);
  }
  
  50% {
    filter: saturate(5) hue-rotate(360deg)
  }
  
  100% {
    filter: saturate(5) hue-rotate(0deg);
  }
}
  
`;

let html = `<head><title>Demo of Minecraft Items as CSS</title><link rel="stylesheet" href="./minecraft-items-spritesheet.css"><style>.mc-icon {
  background-image: url('./mcsprite.png');}</style></head><body>`;

for (const item in items) {
  const i = items[item];
  const row = (Math.floor(i.pos / 32));
  const column = (Math.floor(i.pos % 32)) - 1;
  const className = item.replace(/[^\w\s]/gi, '').toLowerCase().split(' ').join('-');
  css += `
.icon-${className} {
  --n:1; /* scale */
  
  /* coordinates of the image */
  --row:-${column === -1 ? row - 1 : row}; 
  --column:${column === -1 ? 33 : '-' + column}; 
}
  `

  html += `<br>
<br>
${item}
<div style="display: block">

<div class="mc-icon icon-${className}"></div>
<div class="mc-icon icon-size-64 icon-${className}"></div>
<div class="mc-icon icon-size-128 icon-${className}"></div>
<div class="mc-icon icon-size-256 icon-${className}"></div>
<!--<div class="mc-icon icon-size-256 icon-${className} enchanted"><div></div></div>-->
</div>
 .${className}
<br><br>  --row:-${row}; <br />
  --column:-${column}; <br>
  pos ${i.pos} | ${i.pos % 32}<br>`
}

html += `</body>`;

fs.writeFile("./minecraft-items-spritesheet.css", css, (err) => {
  if(!err)
    console.log("Style written")
  else
    console.log(err)
})

fs.writeFile("./index.html", html, (err) => {
  if (!err)
    console.log("File saved")
  else
    console.log(err)
})
