from gigachat import GigaChat

# Укажите ключ авторизации, полученный в личном кабинете, в интерфейсе проекта GigaChat API
with GigaChat(credentials="MWNiMjM5YTgtNzViMS00MWRhLTgwNGUtZTY3NWE5YjY2YzkzOmFmNjE0NTI0LWJmMGItNDIzMi05YWE5LTI3YTg3OTBjNDBlMw==", verify_ssl_certs=False) as giga:
    response = giga.chat("Какие факторы влияют на стоимость страховки на дом?")
    print(response.choices[0].message.content)
