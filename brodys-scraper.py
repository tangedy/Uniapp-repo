### you can add your web scraper here
from bs4 import BeautifulSoup
import requests

def scrapePage():
    programs = []
    hrefs = []
    for i in range(1,17):
        pageToScrape = requests.get(f"https://www.ouinfo.ca/search/{str(i)}?s=computer+science")
        soup = BeautifulSoup(pageToScrape.text, "html.parser")
        programs += soup.findAll('h2',attrs={'class':'result-heading'})
        hrefs += soup.findAll('a',href = True)
    return programs, hrefs

def findPrograms(programs):
    while True:
        inp = input("Enter a university or location: ")
        if not inp:
            break
        for program in programs:
            if inp.lower() in program.text.lower():
                print(program.text)
        print()

programs, hrefs = scrapePage()
for h in hrefs:
    if "Computer Science" in h.text and '/programs' in h['href']:
        print(h.text)
        print('https://www.ouinfo.ca' + h['href'])
        print()
        
# for p in programs:
#     print(p)
# findPrograms(programs)