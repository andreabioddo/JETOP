from datetime import datetime
import csv


def convert_date(date_str):
    return datetime.strptime(date_str, "%d/%m/%Y")


def check_quit(text):
    if "quit" in text:
        return True

def script():
    associato = None
    area_appartenenza = None
    
    while associato is None or associato.strip() == "": 
        associato = input("Inserisci il nome dell'associato: ")
        if(check_quit(associato)): return False

    while area_appartenenza is None or area_appartenenza.strip() == "": 
        area_appartenenza = input("Inserisci l'area di appartenenza: ")
        if(check_quit(area_appartenenza)): return False


    riunioni_pertinenti = []

    with open('riunioni.csv', 'r') as file:
        csv_reader = csv.reader(file, delimiter=';')
        for row in csv_reader:
            nome_riunione, data_riunione, aula_riunione = row
            data_riunione = convert_date(data_riunione)
            
            if "Riunione Generale" in nome_riunione or area_appartenenza in nome_riunione:
                if data_riunione >= datetime.now():
                    riunioni_pertinenti.append((nome_riunione, data_riunione, aula_riunione))

    riunioni_pertinenti.sort(key=lambda x: x[1])

    if(len(riunioni_pertinenti) == 0):
        print(f"{associato}, non ci sono riunuoni per te!")


    else:
        print(f"\n{associato}, ecco le riunioni in programma per te!\n")
        for riunione in riunioni_pertinenti:
            nome_riunione, data_riunione, aula_riunione = riunione
            print(f"Nome: {nome_riunione}, Data: {data_riunione.strftime('%d/%m/%Y')}, Aula: {aula_riunione}")


    return True




def main():
    print("Scrivi 'quit' in ogni momento per interrompere il programma")
    while  script():
       print("\n\nNuova ricerca:")
    print("Grazie per aver usato il programma!")


if __name__ == "__main__":
    main()