/* Íconos exportados del archivo de Figma para el Home (Explorar, Guardados, Perfil, Mapa).
   Usan currentColor y su propio viewBox. */
const extra = {
  'star-fill': {
    vb: 14,
    type: 'raw',
    body: '<path d="M5.00932 4.80399L6.52455 1.75187C6.71903 1.36005 7.28101 1.36005 7.4755 1.75187L8.9907 4.80399L12.3792 5.29644C12.814 5.35962 12.9872 5.89099 12.6725 6.19578L10.221 8.56989L10.7996 11.9238C10.8739 12.3546 10.4192 12.683 10.0301 12.4796L7.00002 10.8952L3.96988 12.4796C3.58087 12.683 3.12616 12.3546 3.20045 11.9238L3.779 8.56989L1.32754 6.19578C1.01279 5.89099 1.18607 5.35962 1.62082 5.29644L5.00932 4.80399Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  'filter-list': {
    vb: 22,
    type: 'raw',
    body: '<path d="M2.75 5.5H19.25M6.41666 11H15.5833M10.0833 16.5H11.9167" stroke="currentColor" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  // Controles deslizantes: el ícono que se reconoce como "filtros"
  'filtros-sliders': {
    vb: 24,
    type: 'raw',
    body: '<path d="M4 6H11M17 6H20M4 12H6M12 12H20M4 18H13M19 18H20" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><circle cx="14" cy="6" r="2.25" stroke="currentColor" stroke-width="1.75"/><circle cx="9" cy="12" r="2.25" stroke="currentColor" stroke-width="1.75"/><circle cx="16" cy="18" r="2.25" stroke="currentColor" stroke-width="1.75"/>',
  },
  'dollar-circle': {
    vb: 16,
    type: 'raw',
    body: '<path d="M8 14.6663C11.6819 14.6663 14.6667 11.6815 14.6667 7.99967C14.6667 4.31777 11.6819 1.33301 8 1.33301C4.31809 1.33301 1.33333 4.31777 1.33333 7.99967C1.33333 11.6815 4.31809 14.6663 8 14.6663Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10.9277C9.02413 10.9645 10 10.4743 10 9.33366C10 7.33366 6.33333 8.33366 6.33333 6.33367C6.33333 5.24698 7.1206 4.84914 8 4.87281C8.73913 4.89269 9.54333 5.21033 10 5.66699M8 4.87281V3.66699M6 10.0003C6.42965 10.5732 7.22853 10.8999 8 10.9277M8 10.9277V12.3337" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  'map-fill': {
    vb: 24,
    type: 'raw',
    body: '<path fill-rule="evenodd" clip-rule="evenodd" d="M8.161 2.58002C8.42148 2.44969 8.70874 2.38184 9 2.38184C9.29126 2.38184 9.57852 2.44969 9.839 2.58002L14.832 5.07802C14.938 5.13002 15.062 5.13002 15.168 5.07802L19.037 3.14302C19.3228 3.00021 19.6404 2.93282 19.9596 2.94725C20.2788 2.96167 20.5891 3.05743 20.8609 3.22544C21.1327 3.39344 21.357 3.62812 21.5126 3.9072C21.6682 4.18628 21.7499 4.50049 21.75 4.82002V17.305C21.75 18.015 21.349 18.665 20.713 18.982L15.838 21.419C15.5778 21.549 15.2909 21.6167 15 21.6167C14.7091 21.6167 14.4222 21.549 14.162 21.419L9.168 18.922C9.11585 18.8959 9.05833 18.8823 9 18.8823C8.94167 18.8823 8.88415 18.8959 8.832 18.922L4.964 20.857C4.67812 21.0001 4.36042 21.0676 4.04107 21.0533C3.72173 21.039 3.41134 20.9433 3.1394 20.7753C2.86746 20.6072 2.643 20.3725 2.48733 20.0933C2.33167 19.8141 2.24997 19.4997 2.25 19.18V6.69502C2.25 5.98502 2.651 5.33502 3.286 5.01802L8.161 2.58102V2.58002ZM9 6.00002C9.19891 6.00002 9.38968 6.07904 9.53033 6.21969C9.67098 6.36034 9.75 6.55111 9.75 6.75002V15C9.75 15.1989 9.67098 15.3897 9.53033 15.5304C9.38968 15.671 9.19891 15.75 9 15.75C8.80109 15.75 8.61032 15.671 8.46967 15.5304C8.32902 15.3897 8.25 15.1989 8.25 15V6.75002C8.25 6.55111 8.32902 6.36034 8.46967 6.21969C8.61032 6.07904 8.80109 6.00002 9 6.00002ZM15.75 9.00002C15.75 8.80111 15.671 8.61034 15.5303 8.46969C15.3897 8.32904 15.1989 8.25002 15 8.25002C14.8011 8.25002 14.6103 8.32904 14.4697 8.46969C14.329 8.61034 14.25 8.80111 14.25 9.00002V17.25C14.25 17.4489 14.329 17.6397 14.4697 17.7804C14.6103 17.921 14.8011 18 15 18C15.1989 18 15.3897 17.921 15.5303 17.7804C15.671 17.6397 15.75 17.4489 15.75 17.25V9.00002Z" fill="currentColor"/>',
  },
  share: {
    vb: 16,
    type: 'raw',
    body: '<g fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12.667" r="2"/><circle cx="12" cy="3.333" r="2"/><circle cx="4" cy="8" r="2"/></g><path d="M10.3333 4.33301L5.66666 6.99967M5.66666 9L10.3333 11.6667" stroke="currentColor"/>',
  },
  // Detalle del Quad y filtros (Iconoir)
  "share-ios": { type: "stroke", body: "<path d=\"M20 13V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V13\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M12 15V3M12 3L8.5 6.5M12 3L15.5 6.5\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" },
  "video-camera": { type: "stroke", body: "<path d=\"M15 12V16.4C15 16.7314 14.7314 17 14.4 17H3.6C3.26863 17 3 16.7314 3 16.4V7.6C3 7.26863 3.26863 7 3.6 7H14.4C14.7314 7 15 7.26863 15 7.6V12ZM15 12L20.0159 7.82009C20.4067 7.49443 21 7.77232 21 8.28103V15.719C21 16.2277 20.4067 16.5056 20.0159 16.1799L15 12Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" },
  "send-fill": { type: "fill", body: "<path d=\"M22 12L3 20L6.5625 12L3 4L22 12Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/>" },
  "check-circle": { type: "stroke", body: "<circle cx=\"12\" cy=\"12\" r=\"9.25\" stroke=\"currentColor\"/><path d=\"M7.75 12.5L10.5 15.25L16.25 9.5\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" },
  "send": { type: "stroke", body: "<path d=\"M22 12L3 20L6.5625 12L3 4L22 12Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M6.5 12L22 12\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" },
  "xmark": { type: "stroke", body: "<path d=\"M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" },
  "bathroom": { type: "stroke", body: "<path d=\"M21 13V16C21 18.2091 19.2091 20 17 20H7C4.79086 20 3 18.2091 3 16V13.6C3 13.2686 3.26863 13 3.6 13H21Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M16 20L17 22\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M8 20L7 22\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M21 13V7C21 4.79086 19.2091 3 17 3H12\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M15.4 8H8.60003C8.26865 8 8.00393 7.7317 8.04019 7.4023C8.18624 6.07539 8.86312 3 12 3C15.1369 3 15.8138 6.07539 15.9598 7.4023C15.9961 7.73169 15.7314 8 15.4 8Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" },
  "sofa": { type: "stroke", body: "<path d=\"M2 16L2 19\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M4 9V7C4 5.89543 4.89543 5 6 5L18 5C19.1046 5 20 5.89543 20 7V9\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M20 9C18.8954 9 18 9.89543 18 11V13H6V11C6 9.89543 5.10457 9 4 9C2.89543 9 2 9.89543 2 11V17H22V11C22 9.89543 21.1046 9 20 9Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M22 16L22 19\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" },
  "refresh-double": { type: "stroke", body: "<path d=\"M21.1679 8C19.6247 4.46819 16.1006 2 11.9999 2C6.81459 2 2.55104 5.94668 2.04932 11\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M2.88146 16C4.42458 19.5318 7.94874 22 12.0494 22C17.2347 22 21.4983 18.0533 22 13\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M7.04932 16H2.64932C2.31795 16 2.04932 16.2686 2.04932 16.6V21\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" },
  "droplet": { type: "stroke", body: "<path d=\"M20 14C20 9.58172 12 2 12 2C12 2 4 9.58172 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14Z\" stroke=\"currentColor\"/>" },
  "chat-bubble-fill": { type: "fill", body: "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 13.8563 1.72113 15.6046 2.55076 17.1298L1.76267 21.3627C1.71742 21.6058 1.79485 21.8555 1.96967 22.0303C2.14448 22.2051 2.39422 22.2826 2.63727 22.2373L6.87016 21.4493C8.39536 22.2788 10.1437 22.75 12 22.75C17.937 22.75 22.75 17.937 22.75 12C22.75 6.06293 17.937 1.25 12 1.25ZM17 10.75C16.3097 10.75 15.75 11.3097 15.75 12C15.75 12.6903 16.3097 13.25 17 13.25C17.6903 13.25 18.25 12.6903 18.25 12C18.25 11.3097 17.6903 10.75 17 10.75ZM10.75 12C10.75 11.3097 11.3097 10.75 12 10.75C12.6903 10.75 13.25 11.3097 13.25 12C13.25 12.6903 12.6903 13.25 12 13.25C11.3097 13.25 10.75 12.6903 10.75 12ZM7 10.75C6.30961 10.75 5.75 11.3097 5.75 12C5.75 12.6903 6.30961 13.25 7 13.25C7.69039 13.25 8.25 12.6903 8.25 12C8.25 11.3097 7.69039 10.75 7 10.75Z\" fill=\"currentColor\"/>" },
  "eye": { type: "stroke", body: "<path d=\"M3 13C6.6 5 17.4 5 21 13\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/> <path d=\"M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" },
}

export default extra
