# =============================================================================
# Processa o vídeo bruto do hero e gera todas as versões usadas no site.
#
# Uso (PowerShell, na pasta do projeto):
#   .\scripts\encode-hero-video.ps1 -Source "C:\caminho\video-bruto.mp4"
#
# Requer ffmpeg no PATH:  winget install Gyan.FFmpeg
#
# Gera em img/hero/:
#   hero_video.mp4      até 1920px H.264  + faststart
#   hero_video.webm     até 1920px VP9
#   hero_video_480.mp4   854px  H.264  + faststart  (celular)
#   hero_video_480.webm  854px  VP9                  (celular)
#   hero_poster.jpg     quadro estático exibido antes do vídeo carregar
#
# -movflags +faststart move o índice (moov atom) para o INÍCIO do .mp4,
# então o vídeo começa a tocar assim que os primeiros dados chegam.
# (WebM já é gravado de forma progressiva, não precisa dessa flag.)
# =============================================================================
param(
  [Parameter(Mandatory = $true)] [string] $Source,
  [int] $Start = 0,          # segundo inicial do trecho
  [int] $Duration = 10,      # duração do loop (curto = arquivo leve)
  [double] $PosterAt = 1.0   # segundo do quadro usado como poster
)

$ErrorActionPreference = 'Stop'
$out = Join-Path $PSScriptRoot '..\img\hero'
New-Item -ItemType Directory -Force $out | Out-Null

$common = @('-nostdin', '-y', '-ss', $Start, '-t', $Duration, '-i', $Source, '-an')   # -an: sem áudio (vídeo mudo)

Write-Host '> hero_video.mp4 (1080p, faststart)'
ffmpeg @common -vf "scale='min(1920,iw)':-2" -c:v libx264 -preset slow -crf 26 -profile:v high -pix_fmt yuv420p `
  -movflags +faststart "$out\hero_video.mp4"

Write-Host '> hero_video_480.mp4 (celular, faststart)'
ffmpeg @common -vf 'scale=854:-2' -c:v libx264 -preset slow -crf 28 -profile:v main -pix_fmt yuv420p `
  -movflags +faststart "$out\hero_video_480.mp4"

Write-Host '> hero_video.webm (1080p)'
ffmpeg @common -vf "scale='min(1920,iw)':-2" -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -deadline good "$out\hero_video.webm"

Write-Host '> hero_video_480.webm (celular)'
ffmpeg @common -vf 'scale=854:-2' -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -deadline good "$out\hero_video_480.webm"

Write-Host '> hero_poster.jpg'
ffmpeg -nostdin -y -ss ($Start + $PosterAt) -i $Source -frames:v 1 -vf "scale='min(1920,iw)':-2" -q:v 3 "$out\hero_poster.jpg"

Write-Host ''
Write-Host 'Pronto.'
Get-ChildItem $out | Select-Object Name, @{ n = 'KB'; e = { [math]::Round($_.Length / 1KB) } }
