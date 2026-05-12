# Kola starter — Wedding Invite Page

Обновлённая версия стартового каркаса.

## Что изменено в этой версии

- в RSVP основной гость теперь указывается как **Имя и фамилия**;
- добавлен блок для дополнительных гостей из семьи;
- можно добавить до **10** дополнительных полей;
- в блоке локаций добавлены фото ЗАГСа и ресторана;
- на кнопки карт повешены временные ссылки на Google Maps;
- тестовый email для будущего form-backend зафиксирован как `craft.754.pinto@gmail.com`, но сама форма пока остаётся в demo-режиме.

## Что нужно подложить в assets

```text
assets/img/couple/hero.jpg
assets/img/couple/gallery-1.jpg
assets/img/couple/gallery-2.jpg
assets/img/couple/gallery-3.jpg
assets/img/details/flowers-qr.jpg
assets/img/venue/zags.jpg
assets/img/venue/restaurant.jpg
```

## Важно по форме

Сейчас форма по-прежнему не отправляет письма реально.
Это безопасный demo-режим.

Следующим шагом нужно будет подключить form-backend и заменить `data-mode="demo"` на рабочий сценарий.
