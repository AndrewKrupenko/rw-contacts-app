import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import {ContactsTable} from "./ContactsTable";
import {CircularProgress, Box} from "@material-ui/core";
import {makeStyles, createStyles} from '@material-ui/core/styles';
import {useState} from "react";
import {DATA_VIEW_MODES} from "./constants";
import {useContacts} from "./useContacts";
import {useDataViewMode} from "./useDataViewMode";
import {ToggleDataViewMode} from "./ToggleDataViewMode";
import {ContactsFilters} from "./ContactsFilters";

const useStyles = makeStyles((theme) => createStyles({
  root: {
    marginTop: theme.spacing(4),
  },
  headContainer: {
    marginBottom: theme.spacing(3),
  },
  filtersContainer: {
    marginBottom: theme.spacing(3),
  },
}));

const FiltersDefaultValue = {
  fullname: "",
  gender: "all",
  nationality: "all",
}

const filterByFullname = ({ first, last }, searchFullname = "") => {
  const firstLast = first + " " + last;
  return firstLast.toLowerCase().includes(searchFullname.toLowerCase())
}

const filterByGender = (gender, searchedGender) => {
  if (searchedGender === "all") {
    return true;
  }
  return gender === searchedGender;
}

const filterByNationality = (nationality, searchedNationality) => {
  if (searchedNationality === "all") {
    return true;
  }
  return nationality === searchedNationality;
}

export const Contacts = () => {
  const classes = useStyles();
  const contacts = useContacts();
  const [dataViewMode, setDataViewMode] = useDataViewMode();

  const [filters, setFilters] = useState(FiltersDefaultValue)

  const updateFilter = (name, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  }

  const clearFilters = () => {
    setFilters(FiltersDefaultValue);
  }

  const filteredContacts = contacts.data
    .filter((contact) => filterByFullname(contact.name, filters.fullname))
    .filter((contact) => filterByGender(contact.gender, filters.gender))
    .filter((contact) => filterByNationality(contact.nat, filters.nationality));

  return (
    <Container className={classes.root}>
      <Grid container>
        <Grid item xs={12} className={classes.headContainer}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4" component="h1">
              Contacts
            </Typography>
            <ToggleDataViewMode
              dataViewMode={dataViewMode}
              setDataViewMode={setDataViewMode}
            />
          </Box>
        </Grid>

        <Grid item xs={12} className={classes.filtersContainer}>
          <ContactsFilters
            filters={filters}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
          />
        </Grid>

        <Grid item xs={12}>
          {(() => {
            if (contacts.isLoading) {
              return <CircularProgress />;
            }

            if (contacts.isError) {
              return <div>Error</div>
            }

            if (dataViewMode === DATA_VIEW_MODES.TABLE) {
              return <ContactsTable data={filteredContacts} />
            }

            if (dataViewMode === DATA_VIEW_MODES.GRID) {
              return "grid";
            }
          })()}
        </Grid>
      </Grid>
    </Container>
  );
};
