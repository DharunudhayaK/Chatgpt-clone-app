import _ from "lodash";

export const onNavigate = _.debounce((url, router, isMounted) => {
  if (isMounted) {
    router.push(url);
  }
}, 20);
