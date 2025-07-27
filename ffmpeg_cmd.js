// for best quality 320kbps segmentation
"ffmpeg -i input.mp3 \
  -vn \
  -c:a aac \
  -b:a 320k \
  -hls_time 10 \
  -hls_playlist_type vod \
  -hls_segment_filename "best_quality/audio_%03d.aac" \
  best_quality/audio.m3u8
"
// for 64 kbps
ffmpeg -i input.mp3 -vn -c:a aac -b:a 64k -hls_time 10 \
-hls_playlist_type vod -hls_segment_filename "hls_64k/audio_%03d.aac" hls_64k/audio.m3u8
// for 96 kbps
ffmpeg -i input.mp3 -vn -c:a aac -b:a 96k -hls_time 10 \
-hls_playlist_type vod -hls_segment_filename "hls_96k/audio_%03d.aac" hls_96k/audio.m3u8
// for 128kbps
ffmpeg -i input.mp3 -vn -c:a aac -b:a 128k -hls_time 10 \
-hls_playlist_type vod -hls_segment_filename "hls_128k/audio_%03d.aac" hls_128k/audio.m3u8
// for 256 kbps
ffmpeg -i input.mp3 -vn -c:a aac -b:a 128k -hls_time 10 \
-hls_playlist_type vod -hls_segment_filename "hls_128k/audio_%03d.aac" hls_128k/audio.m3u8
// for 320 kbps
ffmpeg -i input.mp3 -vn -c:a aac -b:a 320k -hls_time 10 \
-hls_playlist_type vod -hls_segment_filename "hls_320k/audio_%03d.aac" hls_320k/audio.m3u8

//for creating all the versions of the audio along with the master.m3u8
ffmpeg -i input.mp3 \
  -map 0:a -b:a:0 64k -hls_name "64k" \
  -map 0:a -b:a:1 128k -hls_name "128k" \
  -map 0:a -b:a:2 192k -hls_name "192k" \
  -f hls \
  -hls_time 6 \
  -hls_list_size 0 \
  -master_pl_name master.m3u8 \
  -var_stream_map "a:0,name:64k a:1,name:128k a:2,name:192k" \
  output_%v.m3u8
