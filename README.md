# Família JCar Estética Automotiva — site one-page (MVP)

Site estático: `index.html` + `css/styles.css` + `js/main.js`. Não tem build nem bibliotecas.
Para ver: abra `index.html` no navegador ou suba a pasta inteira em qualquer hospedagem estática.

## Estrutura
```
index.html                  página (seções com comentários explicando cada uma)
css/styles.css              tokens no topo (cores, espaçamentos, raios)
js/main.js                  menu, header, vídeo, animações, slider antes/depois
img/hero/                   vídeo e poster do hero
img/resultados/             fotos de antes e depois
scripts/encode-hero-video.ps1   gera os vídeos do hero com ffmpeg (já com -movflags +faststart)
```

## Vídeo do hero
1. Instale o ffmpeg: `winget install Gyan.FFmpeg`
2. `.\scripts\encode-hero-video.ps1 -Source "C:\caminho\video-bruto.mp4" -Start 0 -Duration 12`
3. O vídeo atual já foi processado (origem: `Carro_lavado_com_espuma_20260929095534.mp4`, 1280x720, 10 s).

## Para depois
- **Carro 3D em #servicos:** adicione `<div class="services__stage">` dentro de `.services__layout` e coloque a classe `has-stage` nele.
- **Orçador em 3 passos:** o ponto de encaixe está comentado no começo da seção `#contato`.
- Pendências: procure por `[CONFIRMAR]` no projeto.
