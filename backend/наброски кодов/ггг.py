import requests
import json
import time

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'#самое важное не трогать

def search_vacancies(text, experience, page=0):
    url = 'https://api.hh.ru/vacancies'
    params = {
        'text': text,
        'experience': experience,
        'page': page,
        'per_page': 100,
    }
    headers = {'User-Agent': USER_AGENT}

    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()

        if 'items' in data:
            return data['items']
        else:
            print("Ошибка: Не найдено 'items' в ответе API.")
            return []

    except requests.exceptions.RequestException as e:
        print(f"Ошибка при запросе к API HH.ru: {e}")
        return []
    except json.JSONDecodeError as e:
        print(f"Ошибка при декодировании JSON ответа: {e}")
        return []

def get_vacancy_details(vacancy_id):
    url = f'https://api.hh.ru/vacancies/{vacancy_id}'
    headers = {'User-Agent': USER_AGENT}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Ошибка при запросе деталей вакансии: {e}")
        return {}
    except json.JSONDecodeError as e:
        print(f"Ошибка при декодировании JSON ответа (детали вакансии): {e}")
        return {}

def main():
    search_text = "программист 1С" #вакансия для парсинга
    required_experience = "between1And3"
    #  ID опыта работы:
    #  * noExperience - нет опыта
    #  * between1And3 - от 1 года до 3 лет
    #  * between3And6 - от 3 до 6 лет
    #  * moreThan6 - более 6 лет
    max_vacancies = 20  # Максимальное количество вакансий для вывода
    all_vacancies = []
    total_found = 0 # Отслеживаем общее количество найденных вакансий, даже если не все выводим


    print(f"Парсинг вакансий '{search_text}' с опытом работы: {required_experience}, до {max_vacancies} вакансий")
    page = 0
    while True: #больше не зависит от max_pages
        vacancies = search_vacancies(search_text, required_experience, page)
        if not vacancies:
            break

        all_vacancies.extend(vacancies)
        total_found += len(vacancies) #Обновляем счетчик найденных
        print(f"  Страница {page+1}: найдено {len(vacancies)} вакансий")
        page += 1
        time.sleep(0.25)

        if len(all_vacancies) >= max_vacancies:  #Ограничиваем парсинг по количеству нужных вакансий
            break


    print(f"\nВсего найдено {total_found} вакансий.") #Выводим общее количество найденных вакансий
    displayed_count = 0

    for vacancy in all_vacancies[:max_vacancies]: #Цикл перебирает  только первые max_vacancies вакансий
        vacancy_id = vacancy['id']
        vacancy_details = get_vacancy_details(vacancy_id)

        if vacancy_details:
            print(f"\nВакансия: {vacancy_details.get('name', 'Название отсутствует')}")
            print(f"  URL: {vacancy_details.get('alternate_url', 'URL отсутствует')}")
            print(f"  Компания: {vacancy_details.get('employer', {}).get('name', 'Компания не указана')}")
            print(f"  Описание: {vacancy_details.get('description', 'Описание отсутствует')}")
            displayed_count += 1
        else:
            print(f"Не удалось получить детали вакансии с ID {vacancy_id}")

    print(f"\nВыведено {displayed_count} вакансий из {total_found} найденных.") #Выводим корректную статистику


if __name__ == "__main__":
    main()