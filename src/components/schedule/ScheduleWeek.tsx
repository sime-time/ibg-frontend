import ScheduleDay from "./ScheduleDay";
import ScheduleNewClass from "./ScheduleNewClass";
import ScheduleEditClass from "./ScheduleEditClass";
import ScheduleClassMenu from "./ScheduleClassMenu";
import ScheduleDeleteClass from "./ScheduleDeleteClass";
import ScheduleAttendance from "./ScheduleAttendance";
import { For, createSignal, onMount, Resource } from "solid-js";
import { FaSolidPlus } from "solid-icons/fa";
import { usePocket } from '~/context/PocketbaseContext';
import { ClassRecord, MartialArtRecord } from "~/types/UserType";

interface ScheduleWeekProps {
  classes: Resource<ClassRecord[]>;
  refetch: (info?: unknown) => ClassRecord[] | Promise<ClassRecord[] | undefined> | null | undefined;
}
export default function ScheduleWeek(props: ScheduleWeekProps) {
  const { getMartialArts } = usePocket();

  // propagate the list of martial arts to be used throughout the dashboard
  // this prevents repeated database calls by setting it on the weekly dashboard
  const [martialArtList, setMartialArtList] = createSignal<MartialArtRecord[]>([]);
  onMount(async () => {
    setMartialArtList(await getMartialArts());
  });

  // the selected class should be a signal that is used throughout the dashboard
  // this prevents repeated database calls
  const [classId, setClassId] = createSignal("");

  // needs to be instantiated outside both the Sched.EditClass and Sched.Day components
  // dashboard has to reactively know when this dialog is opened
  const [openEdit, setOpenEdit] = createSignal<boolean>(false);
  const editClass = (id: string) => {
    setClassId(id);
    setOpenEdit(true);
    const dialog = document.getElementById("edit-class-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  // weekly dashboard needs to reactively know which class to take attendance for
  // and know when the attendance dialog is open
  const [openAttendance, setOpenAttendance] = createSignal<boolean>(false);
  const viewAttendance = (id: string) => {
    setClassId(id);
    setOpenAttendance(true);
    const dialog = document.getElementById("attendance-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  const deleteClass = (id: string) => {
    setClassId(id);
    const dialog = document.getElementById("delete-class-dialog") as HTMLDialogElement;
    dialog.showModal();
  };


  const openNewClass = () => {
    const dialog = document.getElementById("new-class-dialog") as HTMLDialogElement;
    dialog.showModal();
  };

  const getDayClasses = (date: Date) => {
    // create an array of all the classes that happen on that day
    // append all classes that are recurring on that week day
    let dayClasses: ClassRecord[] = [];

    if (props.classes() != undefined) {
      for (let i = 0; i < props.classes()!.length; i++) {

        const currentClass = props.classes()?.at(i);

        if (currentClass!.date === date) {
          dayClasses.push(props.classes()![i]);
        } else if (currentClass!.is_recurring && currentClass!.week_day === date.getDay()) {
          dayClasses.push(props.classes()![i]);
        }
      }
    }
    return dayClasses;
  };

  /* render the current week from today's date */
  const loadWeek = () => {
    const today = new Date();
    const week: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const dif = i - today.getDay();
      const day = new Date(today);
      day.setDate(today.getDate() + dif);
      week.push(day);
    }

    return <For each={week}>
      {(day) => (
        <ScheduleDay date={day} classes={getDayClasses(day)} setClassId={setClassId} setOpenEdit={setOpenEdit} />
      )}
    </For>;
  };


  return (<>
    <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3 w-full xl:w-5/6 py-4 px-0">
      {loadWeek()}
      <div class="flex flex-col gap-2 items-center justify-center rounded-lg py-6 border border-neutral">
        <h2 class="text-lg font-semibold text-center">New Class</h2>
        <button onClick={openNewClass} class="btn btn-secondary btn-circle btn-lg xl:btn-md"><FaSolidPlus /> </button>
      </div>
    </div>
    <ScheduleNewClass refetch={props.refetch} martialArtList={martialArtList} />
    <ScheduleEditClass refetch={props.refetch} classId={classId} martialArtList={martialArtList} openEdit={openEdit} setOpenEdit={setOpenEdit} />
    <ScheduleClassMenu classId={classId} editClass={editClass} deleteClass={deleteClass} viewAttendance={viewAttendance} />
    <ScheduleDeleteClass refetch={props.refetch} classId={classId} />
  </>);
}
