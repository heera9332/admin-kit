import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale;
  }

  try {
    const [
      common,
      dashboard,
      form,
      table,
      users,
      tasks,
      chats,
      apps,
      settings,
      auth,
      errors,
      devices,
      helpCenter,
      projects,
    ] = await Promise.all([
      import(`../../messages/${locale}/common.json`),
      import(`../../messages/${locale}/dashboard.json`),
      import(`../../messages/${locale}/form.json`),
      import(`../../messages/${locale}/table.json`),
      import(`../../messages/${locale}/users.json`),
      import(`../../messages/${locale}/tasks.json`),
      import(`../../messages/${locale}/chats.json`),
      import(`../../messages/${locale}/apps.json`),
      import(`../../messages/${locale}/settings.json`),
      import(`../../messages/${locale}/auth.json`),
      import(`../../messages/${locale}/errors.json`),
      import(`../../messages/${locale}/devices.json`),
      import(`../../messages/${locale}/help-center.json`),
      import(`../../messages/${locale}/projects.json`),
    ]);

    return {
      locale,
      messages: {
        common: common.default,
        nav: common.default.nav,
        header: common.default.header,
        localeSwitcher: common.default.localeSwitcher,
        dashboard: dashboard.default,
        form: form.default,
        table: table.default,
        users: users.default,
        tasks: tasks.default,
        chats: chats.default,
        apps: apps.default,
        settings: settings.default,
        auth: auth.default,
        errors: errors.default,
        devices: devices.default,
        helpCenter: helpCenter.default,
        projects: projects.default,
      },
    };
  } catch {
    return {
      locale,
      messages: (await import(`../../messages/${locale}.json`)).default,
    };
  }
});
