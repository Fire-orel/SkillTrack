import requests
from bs4 import BeautifulSoup

url = 'https://developers.sber.ru/help'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
urls_list = []

articles = soup.find_all('div', class_='Cell-sc-22bce6e3-0 gPJwHF')

for article in articles:
    links = article.find('a', href=True)['href']
    if links:
        urls_list.append(f"https://developers.sber.ru{links}")

for urls in urls_list:
    response = requests.get(urls)
    soup = BeautifulSoup(response.text, 'html.parser')
    articles = soup.find_all('div', class_='Cell-sc-c2899c52-0 cmQkJU')

    for article in articles:
        title = article.find('div', class_='plasma-new-hope__sc-1xug4g9-0 cQUwqC typography-bold typo__BodyL-sc-45e1da05-17 fRTVYY')
        if title:
            title_text = title.text.strip()

        first_paragraph = article.find('div', class_='plasma-new-hope__sc-1xug4g9-0 hQTHVb typo__BodyM-sc-45e1da05-18 ShhxH')
        if first_paragraph:
            first_paragraph_text = first_paragraph.text.strip()

        link = article.find('a', href=True)['href']
        if link:
            full_article_url = f"https://developers.sber.ru{link}"

        print(f"Заголовок: {title_text}")
        print(f"Первый абзац: {first_paragraph_text}")
        print(f"Ссылка на полную статью: {full_article_url}")
        print("---")
